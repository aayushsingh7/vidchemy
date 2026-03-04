import {S3Client} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { TranscribeClient } from "@aws-sdk/client-transcribe";
dotenv.config();

const awsConfig = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};

export const s3Client = new S3Client(awsConfig);
export const bedrockClient = new BedrockRuntimeClient(awsConfig)
export const rekognitionClient = new RekognitionClient(awsConfig);
export const transcribeClient = new TranscribeClient(awsConfig);