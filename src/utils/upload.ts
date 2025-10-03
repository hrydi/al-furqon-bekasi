// utils/upload.ts
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (_req: Express.Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });
