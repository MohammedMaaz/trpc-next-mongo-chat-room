import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SIGNED_URL_EXPIRATION = 5 * 60; // 5 minutes
const client = new S3Client({ region: process.env.AWS_S3_REGION });

const getKeyFromMsgId = (msgId: string): string => {
  return `${msgId}.jpg`;
};

export const getPreSignedUrl = (msgId: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: getKeyFromMsgId(msgId),
  });
  return getSignedUrl(client, command, { expiresIn: SIGNED_URL_EXPIRATION });
};

export const deleteImg = (
  msgId: string
): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: getKeyFromMsgId(msgId),
  });
  return client.send(command);
};

export const getImgUrl = (msgId: string): string => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${
    process.env.AWS_S3_REGION
  }.amazonaws.com/${getKeyFromMsgId(msgId)}`;
};
