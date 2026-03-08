import {GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {s3Client} from "../../shared/config/awsClients.config.js";
import CustomError from "../../shared/utils/custom-error.util.js";
import {Upload} from "@aws-sdk/lib-storage";

function generateId(length = 15) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

class AWSService {
    async generatePresignedUrl({fileName, fileType}) {
        if (!fileName || !fileType) throw new CustomError("File name and type is required", 400);
        console.log({fileName, fileType, url: process.env.CLOUD_FRONT_URL});
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `videos/${Date.now()}_${generateId(20)}`,
            ContentType: fileType,
        };

        try {
            const command = new PutObjectCommand(params);
            const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 3600});

            return {
                uploadUrl: signedUrl,
                fileKey: params.Key,
            };
        } catch (err) {
            console.error(err);
            throw new Error("Something went wrong, try again later", 500);
        }
    }

    generateKey(prefix) {
        return `${prefix}/${Date.now()}_${generateId(20)}`;
    }

    async getS3Object(s3VideoKey) {
        return await s3Client.send(
            new GetObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: s3VideoKey,
            })
        );
    }

    async uploadStream({key, stream, contentType}) {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
                Body: stream,
                ContentType: contentType,
            },
        });

        return upload.done();
    }

    async uploadBase64({base64, key, contentType = "image/jpeg"}) {
        const buffer = Buffer.from(base64, "base64");
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        });

        await s3Client.send(command);
        return key;
    }
}

export default AWSService;
