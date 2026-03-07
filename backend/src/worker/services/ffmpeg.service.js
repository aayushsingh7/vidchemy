import ffmpeg from "fluent-ffmpeg";

class FfmpegService {
    #awsService;
    constructor(awsService) {
        this.#awsService = awsService;
        ffmpeg.setFfmpegPath(process.env.NODE_ENV == "development" ? "/usr/bin/ffmpeg" : "C:\\ffmpeg\\ffmpeg.exe");
    }


    async #extractSingleFrame({s3Key, timestamp, targetS3Key}) {
        console.log("started extractSingleFrame()");
        const seconds = timestamp / 1000;

        const s3Object = await this.#awsService.getS3Object(s3Key);

        const ffmpegPromise = new Promise((resolve, reject) => {
            const chunks = [];

            ffmpeg(s3Object.Body)
            .seekInput(seconds)
            .frames(1)
            .format("image2pipe")
            .videoCodec("mjpeg")
            .videoFilter("pad=max(iw\\,ih):max(iw\\,ih):(ow-iw)/2:(oh-ih)/2:white")
            .on("error", (err) => {
                console.error("FFmpeg Error:", err);
                reject(err);
            })
            .pipe()
            .on("data", (chunk) => {
                chunks.push(chunk);
            })
            .on("end", () => {
                const finalBuffer = Buffer.concat(chunks);
                resolve(finalBuffer);
            });
        });
        try {
            const imageBuffer = await ffmpegPromise;
            return {key: targetS3Key, buffer: imageBuffer};
        } catch (err) {
            console.error("Extraction process failed:", err);
            throw err;
        }
    }

    async extractProductFramesBatched({s3Key, frameData, batchSize = 3}) {
        const data = [];
        console.log(`🎬 Starting extraction for ${frameData.length} frames (Batch Size: ${batchSize})...`);
        for (let i = 0; i < frameData.length; i += batchSize) {
            const batch = frameData.slice(i, i + batchSize);
            console.log(`⏳ Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} frames)...`);
            const batchPromises = batch.map((data, index) => {
                const overallIndex = i + index;
                const baseName = s3Key.slice(7);
                const targetS3Key = `images/${baseName}_${overallIndex + 1}_${data / 1000}`;
                return this.#extractSingleFrame({
                    s3Key,
                    timestamp: data,
                    targetS3Key,
                }).catch((error) => {
                    console.error(`❌ Error at ${data}s:`, error.message);
                    return null;
                });
            });
            const batchResults = await Promise.all(batchPromises);
            data.push(...batchResults.filter(Boolean));
        }

        console.log("✅ All batches completed successfully!", {data});
        return data;
    }
}

export default FfmpegService;
