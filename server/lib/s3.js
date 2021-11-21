const dotenv = require("dotenv");
const aws = require("aws-sdk");
const crypto = require("crypto");
const util = require("util");
const promisify = util.promisify;
const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const region = "ap-northeast-2";
const bucketName = "namu-alien-s3";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");
  console.log(imageName);

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
}

exports.generateUploadURL = generateUploadURL;

// import dotenv from "dotenv";
// import aws from "aws-sdk";
// import crypto from "crypto";
// import { promisify } from "util";
// const randomBytes = promisify(crypto.randomBytes);

// dotenv.config();

// const region = "ap-northeast-2";
// const bucketName = "namu-alien-s3";
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// const s3 = new aws.S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
//   signatureVersion: "v4",
// });

// export async function generateUploadURL() {
//   const rawBytes = await randomBytes(16);
//   const imageName = rawBytes.toString("hex");
//   console.log(imageName);

//   const params = {
//     Bucket: bucketName,
//     Key: imageName,
//     Expires: 60,
//   };

//   const uploadURL = await s3.getSignedUrlPromise("putObject", params);
//   return uploadURL;
// }
