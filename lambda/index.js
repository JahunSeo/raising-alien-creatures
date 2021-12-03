const sharp = require("sharp");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const Bucket = "mygumi-resource";
const transforms = [
  { name: "w_200", width: 200 },
  { name: "w_400", width: 400 },
  { name: "w_600", width: 600 },
];

exports.handler = async (event, context, callback) => {
  const key = event.Records[0].s3.object.key;
  const sanitizedKey = key.replace(/\+/g, " ");
  const parts = sanitizedKey.split("/");
  const filename = parts[parts.length - 1];

  try {
    const image = await s3.getObject({ Bucket, Key: sanitizedKey }).promise();

    await Promise.all(
      transforms.map(async (item) => {
        const resizedImg = await sharp(image.Body)
          .resize({ width: item.width })
          .toBuffer();
        return await s3
          .putObject({
            Bucket,
            Body: resizedImg,
            Key: `images/${item.name}/${filename}`,
          })
          .promise();
      })
    );
    callback(null, `Success: ${filename}`);
  } catch (err) {
    callback(`Error resizing files: ${err}`);
  }
};

// const AWS = require('aws-sdk');
// const sharp = require('sharp');

// const s3 = new AWS.S3();

// exports.handler = async (event, context, callback) => {
//     const Bucket = event.Records[0].s3.bucket.name; // react-nodebird-loosie
//     const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/123123123_abc.png
//     console.log(Bucket, Key);

//     const filename = Key.split('/')[Key.split('/').length - 1];
//     const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase();
//     const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;

//     console.log('filename : ', filename, 'ext', ext);

//     try{
//         const s3Object = await s3.getObject({ Bucket, Key }).promise();
//         console.log('original', s3Object.Body.length);

//         const resizedImage = await sharp(s3Object.Body)
//             .resize(400, 400, { fit: 'inside'})
//             .toFormat(requiredFormat)
//             .toBuffer();
//         await s3.putObject({
//             Bucket,
//             Key: `thumb/${filename}`,
//             Body: resizedImage,
//         }).promise();
//         console.log('put', resizedImage.length);

//         return callback(null, `thumb/${filename}`);
//     } catch (error){
//         console.error(error);
//         return callback(error);
//     }
// }
