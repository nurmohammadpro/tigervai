import {
  CreateBucketCommand,
  DeleteObjectCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createReadStream } from "fs";
import { extname } from "path";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadServiceService implements OnModuleInit {
  private logger = new Logger(UploadServiceService.name);

  private s3: S3Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const minioUrl = this.configService.get<string>("MINIO_URL") as string;
    const accessKeyId = this.configService.get<string>("MINIO_ACCESS_KEY")  as string;
    const secretAccessKey = this.configService.get<string>("MINIO_SECRET_KEY")  as string;

    this.s3 = new S3Client({
      region: "us-east-1",
      endpoint: minioUrl,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    await this.createBucketIfNotExists("my-tiger-vai-bucket");
    await this.makeBucketPublic("my-tiger-vai-bucket");
  }

  async createBucketIfNotExists(bucketName: string) {
    try {
      await this.s3.send(new CreateBucketCommand({ Bucket: bucketName }));
      this.logger.debug(`Bucket '${bucketName}' created.`);
    } catch (err) {
      if (
        err?.name === "BucketAlreadyOwnedByYou" ||
        err?.name === "BucketAlreadyExists"
      ) {
        return;
      }
      throw err;
    }
  }

  async makeBucketPublic(bucketName: string) {
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicRead",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await this.s3.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
      }),
    );
  }

  // ✅ Upload single file with UUID as key
async uploadSingleFile(file: Express.Multer.File) {
  this.logger.debug(`Uploading file ${file.originalname}`);

  try {
    if (!file || !file.buffer) {
      throw new Error("File buffer is missing");
    }
 const extension = extname(file.originalname);
 const key = uuidv4();
    const finalKey = `${key}${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: "my-tiger-vai-bucket",
        Key: finalKey,
        Body: file.buffer,   // ✅ No stream, no file.path needed
        ContentType: file.mimetype,
      }),
    );

    const url = `${this.configService.get(
      "MINIO_URL",
    )}/my-tiger-vai-bucket/${finalKey}`;

    return { url, key:finalKey };
  } catch (err) {
    this.logger.error(err);
    throw new HttpException("Upload failed", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  // ✅ Upload multiple (max 5)
  async uploadMultipleFiles(files: Express.Multer.File[]) {
    const results: { url: string; key: string }[] = [];

    for (const file of files) {
      const uploaded = await this.uploadSingleFile(file);
      results.push(uploaded);
    }

    return results;
  }

  // ✅ Delete using key (UUID)
  async deleteFile(key: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: "my-tiger-vai-bucket",
          Key: key,
        }),
      );
      return true;
    } catch (err) {
      throw new HttpException(
        "Delete failed",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
