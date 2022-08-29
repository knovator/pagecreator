import { File } from '../models/file';
import { promisify } from 'util';
import { existsSync, unlinkSync } from 'fs';
import imageSize from 'image-size';

const sizeOf = promisify(imageSize);

const fileData = async (file, folder) => {
  if (
    !file.name.match(
      /\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF|docx|DOCX|mp4|MP4|doc|DOC|webm|WEBM|avi|AVI)$/
    )
  ) {
    throw new Error('Only images files are allowed.');
  }
  const fileName = file.name;
  const pathToStore = `./public/uploads/${folder}/${fileName}`;
  await file.mv(pathToStore);
  const fileObj = {
    name: file.name,
    mimetype: file.mimetype,
    size: file.size,
    uri: `/uploads/${folder}/${fileName}`,
    type: file.mimetype,
    height: 0,
    width: 0,
  };
  if (file.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    const dimensions = await sizeOf(pathToStore);
    fileObj.height = dimensions.height;
    fileObj.width = dimensions.width;
  }
  return fileObj;
};
export const removeFile = async (req, res) => {
  const id = req.params.id;
  //   const findFile = await getDocumentByQuery(File, { _id: id });
  const findFile = await File.findById(id);
  const result = await File.deleteOne({ _id: id });
  if (result.deletedCount) {
    const path = `./public/uploads${findFile.uri}`;
    if (existsSync(path)) {
      unlinkSync(path);
    }
    return res.status(200).send({
      message: 'File Deleted Successfully',
    });
  } else {
    return res.status(400).send({
      message: 'Error occured while deleting file',
    });
  }
};
export const fileUpload = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send({
        message: 'No file uploaded',
      });
    } else {
      let result;
      const files = req.files[Object.keys(req.files)[0]];
      const folder = 'temp';
      if (Array.isArray(files) === false) {
        const data = await fileData(files, folder);
        result = await File.create(data);
      } else {
        result = [];
        return res.status(400).send({
          message: 'Only single file upload is allowed',
        });
      }
      return res.status(200).send({
        code: 'SUCCESS',
        data: result,
        message: 'Image Uploaded successfully.',
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};
