import { existsSync, mkdirSync } from 'fs';

export const ensureDirectoryExistence = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};
