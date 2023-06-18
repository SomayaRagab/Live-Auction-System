const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = async function handleTempImage(request) {
  // console.log(request.file);
  const fileExtension = await getFileExtension(request.file.originalname);
  const filetypes = /jpeg|jpg|png|gif/;
  if (!filetypes.test(fileExtension)) {
    throw new Error('Invalid image type');
  }
  const tempFilePath = path.join(os.tmpdir(), `temp_image${fileExtension}`);
  await fs.promises.writeFile(tempFilePath, request.file.buffer);
  return tempFilePath;
};

async function getFileExtension(filename) {
  const ext = path.extname(filename);
  if (!ext) {
    throw new Error('Missing image extension');
  }
  return ext.toLowerCase();
}
