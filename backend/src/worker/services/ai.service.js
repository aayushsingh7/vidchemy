import dotenv from "dotenv";
dotenv.config();
import {ConverseCommand, InvokeModelCommand} from "@aws-sdk/client-bedrock-runtime";
import {GetLabelDetectionCommand, StartLabelDetectionCommand} from "@aws-sdk/client-rekognition";
import {GetTranscriptionJobCommand, StartTranscriptionJobCommand} from "@aws-sdk/client-transcribe";
import Perplexity from "@perplexity-ai/perplexity_ai";
import {bedrockClient, rekognitionClient, transcribeClient} from "../../shared/config/awsClients.config.js";
import CustomError from "../../shared/utils/custom-error.util.js";
import AI_OPERATIONS from "../../shared/config/ai-operations.config.js";
import {formatOriginalProduct, formatReferenceProduct} from "../utils/format-product.util.js";

const perplexityClient = new Perplexity({apiKey: process.env.PERPLEXITY_API_KEY});
const mvpFilters = {
    Headphones: ["Headphone"],
    Watch: ["Watch"],
    Shoe: ["Shoe"],
    Bag: ["Bag"],
    Sunglasses: ["Sunglasses"],
    "Mobile Phone": ["Cell Phone"],
    Laptop: ["Laptop"],
    Jacket: ["Jacket"],
    Shirt: ["Shirt"],
    Cosmetics: ["Cosmetics"],
};

class AIService {
    #aiOperations;
    #awsService;
    constructor(awsService) {
        this.#aiOperations = AI_OPERATIONS;
        this.#awsService = awsService;
    }

    async #removeImageBackground({key, buffer}) {
        try {
            const base64 = buffer.toString("base64");
            const payload = {
                taskType: "BACKGROUND_REMOVAL",
                backgroundRemovalParams: {
                    image: base64,
                },
            };

            const command = new InvokeModelCommand({
                modelId: "amazon.titan-image-generator-v2:0",
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify(payload),
            });

            const response = await client.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            const resultBase64 = responseBody.images[0];
            await this.#awsService.uploadBase64({base64: resultBase64, key: key, contentType: "image/jpeg"});
            return `${process.env.CLOUD_FRONT_URL}/${key}`;
        } catch (err) {
            console.error("Error removing background:", err);
            throw err;
        }
    }

    async analyzeVideoContent({s3Key, productType, title, description}) {
        console.log("amazon.nova-pro-v1:0");
        const op = this.#aiOperations.BEDROCK_VIDEO_ANALYSIS;
        const command = new ConverseCommand({
            modelId: "arn:aws:bedrock:ap-south-1:727646487353:inference-profile/apac.amazon.nova-pro-v1:0",
            system: [{text: op.system}],
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            video: {
                                format: "mp4",
                                source: {s3Location: {uri: `s3://${process.env.AWS_S3_BUCKET_NAME}/${s3Key}`}},
                            },
                        },
                        {text: op.user({description, productType, title})},
                    ],
                },
            ],
            toolConfig: {
                tools: [
                    {
                        toolSpec: {
                            name: "return_video_analysis",
                            description: "Returns the structured analysis of the product video.",
                            inputSchema: {
                                json: op.responseSchema,
                            },
                        },
                    },
                ],
                toolChoice: {
                    tool: {name: "return_video_analysis"},
                },
            },
        });

        try {
            const response = await bedrockClient.send(command);
            const toolCall = response.output.message.content.find((c) => c.toolUse);

            if (toolCall) {
                const finalData = toolCall.toolUse.input;
                return finalData;
            } else {
                console.error("Model did not use the required tool for output.");
                throw new CustomError("Something went wrong while analyzing the video", 500);
            }
        } catch (err) {
            console.error("Error analyzing video:", err);
            throw err;
        }
    }

    async backgroundRemoval(bufferedImages) {
        try {
            const batchPromises = bufferedImages.map((imageData) => {
                return this.#removeImageBackground({key: imageData.key, buffer: imageData.buffer}).catch((err) => {
                    console.log("ERROR WHILE REMOVING BACKGROUND: ", err.message);
                    return null;
                });
            });

            const batchResults = await Promise.all(batchPromises);
            return batchResults.filter(Boolean);
        } catch (err) {
            console.error(err);
            throw new CustomError("Something went wrong while removing the background", 500);
        }
    }

    async researchProductDetails({productName, website, additionalContext}) {
        if (!productName) throw new CustomError("Product name is required", 400);
        const op = this.#aiOperations.PERPLEXITY_PRODUCT_RESEARCH;
        try {
            const completion = await perplexityClient.chat.completions.create({
                model: "sonar-pro",
                messages: [
                    {
                        role: "user",
                        content: op.user({productName, website, addtionalContext}),
                    },
                ],
                max_tokens: 2000,
                temperature: 0.1,
                response_format: op.responseSchema,
            });

            return completion.choices[0].message.content;
        } catch (err) {
            console.error(err);
            throw new CustomError("Failed to retrieve product details", 500);
        }
    }

    async draftOptimizedListing({referenceProducts, originalProduct}) {
        const formattedReferenceProduct = referenceProducts.map((product, index) => {
            formatReferenceProduct(product, index + 1);
        });
        const formattedOriginalProduct = formatOriginalProduct(originalProduct);

        const op = this.#aiOperations.BEDROCK_LISTING_GENERATION;
        const command = new ConverseCommand({
            modelId: "arn:aws:bedrock:ap-south-1:727646487353:inference-profile/apac.amazon.nova-pro-v1:0",
            system: [{text: op.system}],
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            text: op.user({
                                referenceProducts: formattedReferenceProduct,
                                originalProduct: formattedOriginalProduct,
                            }),
                        },
                    ],
                },
            ],
            toolConfig: {
                tools: [
                    {
                        toolSpec: {
                            name: "return_generated_listing",
                            description: "Returns the generated listing.",
                            inputSchema: {
                                json: op.responseSchema,
                            },
                        },
                    },
                ],
                toolChoice: {
                    tool: {name: "return_generated_listing"},
                },
            },
        });

        try {
            const response = await bedrockClient.send(command);
            const toolCall = response.output.message.content.find((c) => c.toolUse);

            if (toolCall) {
                const finalData = toolCall.toolUse.input;
                return finalData;
            } else {
                console.error("Model did not use the required tool for output.");
                throw new CustomError("Something went wrong while generating listing", 500);
            }
        } catch (err) {
            console.error("Error generating optmized listing");
            throw err;
        }
    }

    async detectVideoLabels({bucketName, s3Key, productType}) {
        try {
            const startCommand = new StartLabelDetectionCommand({
                Video: {
                    S3Object: {
                        Bucket: bucketName,
                        Name: s3Key,
                    },
                },
                Features: ["GENERAL_LABELS"],
                MinConfidence: 80,
                Settings: {
                    GeneralLabels: {
                        LabelInclusionFilters: mvpFilters[productType],
                        LabelExclusionFilters: ["Finger"],
                    },
                },
            });
            const startResponse = await rekognitionClient.send(startCommand);
            const jobId = startResponse.JobId;
            console.log(`VideoLabels Job started successfully. JobId: ${jobId}`);
            let jobComplete = false;

            while (!jobComplete) {
                console.log("Checking job status...");
                const getCommand = new GetLabelDetectionCommand({JobId: jobId});
                const getResponse = await rekognitionClient.send(getCommand);

                if (getResponse.JobStatus === "SUCCEEDED") {
                    console.log("\n--- Job Succeeded! ---" + "\n Total Labels Found: " + getResponse?.Labels?.length);
                    jobComplete = true;
                    return getResponse;
                } else if (getResponse.JobStatus === "FAILED") {
                    console.error("Job failed:", getResponse.StatusMessage);
                    jobComplete = true;
                    throw new Error("Rekognition Video Job Failed");
                } else {
                    // JobStatus is "IN_PROGRESS"
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
        } catch (err) {
            console.error("Error while analyzing s3 video", err);
            throw err;
        }
    }

    async transcribeS3Video({bucketName, s3Key}) {
        const jobName = `TranscriptionJob-${Date.now()}`;
        const s3Uri = `s3://${bucketName}/${s3Key}`;

        try {
            console.log(`Starting transcription for ${s3Uri}...`);
            console.log(`Job Name: ${jobName}`);
            const startCommand = new StartTranscriptionJobCommand({
                TranscriptionJobName: jobName,
                Media: {
                    MediaFileUri: s3Uri,
                },
                LanguageCode: "en-US",
            });

            await transcribeClient.send(startCommand);
            console.log("Job started successfully. Waiting for completion...");

            // 2. Poll the API until the job is complete
            let jobComplete = false;

            while (!jobComplete) {
                const getCommand = new GetTranscriptionJobCommand({TranscriptionJobName: jobName});
                const getResponse = await transcribeClient.send(getCommand);
                const status = getResponse.TranscriptionJob.TranscriptionJobStatus;

                if (status === "COMPLETED") {
                    console.log("\n--- Transcription Job Succeeded! ---");
                    jobComplete = true;
                    // Transcribe provides a pre-signed URL to download the result
                    const transcriptFileUri = getResponse.TranscriptionJob.Transcript.TranscriptFileUri;
                    console.log("Downloading transcript data...");
                    const fileResponse = await fetch(transcriptFileUri);
                    const transcriptData = await fileResponse.json();
                    const text = transcriptData.results.transcripts[0].transcript;

                    console.log("\n--- Final Transcript ---");
                    console.log(text);

                    return text;
                } else if (status === "FAILED") {
                    console.error("Job failed:", getResponse.TranscriptionJob.FailureReason);
                    jobComplete = true;
                    throw new Error("Transcribe Job Failed");
                } else {
                    process.stdout.write(".");
                    await new Promise((resolve) => setTimeout(resolve, 10000));
                }
            }
        } catch (err) {
            console.error("\nError transcribing video:", err);
            throw err;
        }
    }
}

export default AIService;
