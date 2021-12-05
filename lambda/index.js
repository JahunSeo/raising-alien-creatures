// dependencies
const AWS = require("aws-sdk");
const util = require("util");
const sharp = require("sharp");

// get reference to S3 client
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  // Read options from the event parameter.
  console.log(
    "Reading options from event:\n",
    util.inspect(event, { depth: 5 })
  );
  const srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters.
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const dstBucket = srcBucket;
  const dstKey = srcKey;
  const parts = srcKey.split("/");
  const filename = parts[parts.length - 1];

  // Infer the image type from the file suffix.
  const typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log("Could not determine the image type.");
    return "1";
  }

  // Check that the image type is supported
  const imageType = typeMatch[1].toLowerCase();
  if (imageType != "jpg" && imageType != "png" && imageType != "jpeg") {
    console.log(`Unsupported image type: ${imageType}`);
    return "2";
  }

  // Download the image from the S3 source bucket.

  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    };
    var origimage = await s3.getObject(params).promise();
  } catch (error) {
    console.log(error);
    return "3";
  }

  // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
  const width = 400;

  // Use the sharp module to resize the image and save in a buffer.
  try {
    var buffer = await sharp(origimage.Body)
      .resize(width)
      .withMetadata()
      .toBuffer();
  } catch (error) {
    console.log(error);
    return "4";
  }

  // Upload the thumbnail image to the destination bucket
  try {
    const destparams = {
      Bucket: dstBucket,
      Key: `M/${filename}`,
      Body: buffer,
      ContentType: "image",
    };

    const putResult = await s3.putObject(destparams).promise();
  } catch (error) {
    console.log(error);
    return "5";
  }

  console.log(
    "Successfully resized " +
      srcBucket +
      "/" +
      srcKey +
      " and uploaded to " +
      dstBucket +
      "/" +
      dstKey
  );
};
