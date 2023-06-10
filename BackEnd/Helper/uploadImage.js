const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = function handleTempImage(request){
    const fileExtension = path.extname(request.file.originalname);
    const tempFilePath = path.join(os.tmpdir(), `temp_image${fileExtension}`);  
    fs.writeFileSync(tempFilePath, request.file.buffer);
    return tempFilePath;
}