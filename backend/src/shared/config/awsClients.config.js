import {RekognitionClient} from "@aws-sdk/client-rekognition";
import {TranscribeClient} from "@aws-sdk/client-transcribe";
import {S3Client} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const awsConfig = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};

export const s3Client = new S3Client(awsConfig);
export const rekognitionClient = new RekognitionClient(awsConfig);
export const transcribeClient = new TranscribeClient(awsConfig);
