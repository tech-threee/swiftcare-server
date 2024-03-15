import { Request } from 'express';
import path from 'path';

import { HttpStatus } from '../handlers/handler.util';
import { IFileFilterCallback } from '../interfaces/files.interface';
import ApiError from './apiError';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: IFileFilterCallback,
  allowedExtensions: string[],
  maxFileSize: number,
): void => {
  const extname = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extname)) {
    const error = new ApiError(
      `Only ${allowedExtensions.join(', ')} files are allowed`,
      HttpStatus.UnprocessableEntity,
    );
    return cb(error, false);
  }

  if (req.headers['content-length']) {
    // get file size in mb
    const fileSize = parseInt(req.headers['content-length']) / (1024 * 1024);

    const maxSizeInMB = maxFileSize / (1024 * 1024);

    if (fileSize > maxSizeInMB) {
      const error = new ApiError(`File size exceeds ${maxSizeInMB}MB`, 413);
      return cb(error, false);
    }
  }

  cb(null, true);
};
