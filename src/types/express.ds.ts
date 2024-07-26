// express.d.ts

import { IUser } from 'src/user/user.schema';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser | null;
  }
}
