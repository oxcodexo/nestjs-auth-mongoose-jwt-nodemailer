// dynamic-file.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  Type,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { diskStorage } from 'multer';
import * as multer from 'multer';
import { unlink } from 'fs';
import { extname } from 'path';

export function DynamicFileInterceptor(
  folderName: string,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const multerOptions = {
        storage: diskStorage({
          destination: `./uploads/${folderName}`,
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      };
      const upload = multer(multerOptions).single('image');
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      return new Observable((observer) => {
        upload(request, response, (err: any) => {
          if (err) {
            observer.error(err);
            return;
          }
          next
            .handle()
            .pipe(
              tap(() => observer.next()),
              catchError((err) => {
                if (request.file) {
                  unlink(request.file.path, (unlinkError) => {
                    if (unlinkError) {
                      console.error('Error deleting file:', unlinkError);
                    }
                  });
                }
                observer.error(err);
                return throwError(() => new Error(err));
              }),
            )
            .subscribe({
              next: (result) => observer.next(result),
              error: (err) => observer.error(err),
              complete: () => observer.complete(),
            });
        });
      });
    }
  }

  return mixin(MixinInterceptor);
}
