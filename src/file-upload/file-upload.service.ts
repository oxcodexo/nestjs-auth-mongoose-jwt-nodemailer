// file-upload.service.ts
import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadService {
  // Returns a multer instance configured with the given storage settings
  public getMulterConfig(folderName: string) {
    const storage = diskStorage({
      destination: `./uploads/${folderName}`,
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    });

    const limits = {
      fileSize: 4 * 1024 * 1024, // 8 MB limit
    };

    return multer({ storage, limits });
  }
}
