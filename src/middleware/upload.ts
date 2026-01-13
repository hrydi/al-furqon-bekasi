import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Request } from 'express';
import { AppConfig } from '../utils/config';

// Ensure upload directories exist
const ensureDirectoriesExist = () => {
  const baseDir = path.join(process.cwd(), 'uploads');
  const dirs = [
    path.join(baseDir, 'articles'),
    path.join(baseDir, 'articles', 'temp'),
    path.join(baseDir, 'videos'),
    path.join(baseDir, 'users')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize directories
ensureDirectoriesExist();

// Configure storage for articles
const articleStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    const uploadPath = path.join(process.cwd(), 'uploads', 'articles', String(year), month, 'original');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    cb(null, `article-${name}-${uniqueSuffix}${ext}`);
  }
});

const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
  }
};

export const uploadArticleImage = multer({
  storage: articleStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 5
  }
});

export class ImageProcessor {
  static async processArticleImage(filePath: string, filename: string) {
    try {
      const fileDir = path.dirname(filePath);
      const baseDir = path.dirname(fileDir); 
      
      const thumbnailDir = path.join(baseDir, 'thumbnails');
      const mediumDir = path.join(baseDir, 'medium');
      
      [thumbnailDir, mediumDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      const nameWithoutExt = path.parse(filename).name;
      const ext = '.webp'; 

      const thumbnailPath = path.join(thumbnailDir, `${nameWithoutExt}-thumb${ext}`);
      await sharp(filePath)
        .resize(300, 200, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      const mediumPath = path.join(mediumDir, `${nameWithoutExt}-medium${ext}`);
      await sharp(filePath)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(mediumPath);

      const optimizedPath = path.join(fileDir, `${nameWithoutExt}-optimized${ext}`);
      await sharp(filePath)
        .webp({ quality: 90 })
        .toFile(optimizedPath);

      const baseUrl = AppConfig.baseUrl;
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      
      return {
        original: `${baseUrl}/uploads/articles/${year}/${month}/original/${filename}`,
        optimized: `${baseUrl}/uploads/articles/${year}/${month}/original/${nameWithoutExt}-optimized${ext}`,
        medium: `${baseUrl}/uploads/articles/${year}/${month}/medium/${nameWithoutExt}-medium${ext}`,
        thumbnail: `${baseUrl}/uploads/articles/${year}/${month}/thumbnails/${nameWithoutExt}-thumb${ext}`
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  static async deleteArticleImages(imageUrl: string) {
    try {
      // Extract filename and path from URL
      const urlParts = imageUrl.split('/uploads/');
      if (urlParts.length < 2) return;
      
      const relativePath = urlParts[1];
      const fullPath = path.join(process.cwd(), 'uploads', relativePath);
      
      // Delete original file
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      // Delete associated files (thumbnail, medium, optimized)
      const parsedPath = path.parse(fullPath);
      const baseDir = path.dirname(path.dirname(fullPath)); // Go up to year/month level
      const filename = parsedPath.name;
      
      const relatedFiles = [
        path.join(baseDir, 'thumbnails', `${filename}-thumb.webp`),
        path.join(baseDir, 'medium', `${filename}-medium.webp`),
        path.join(baseDir, 'original', `${filename}-optimized.webp`)
      ];

      relatedFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });

    } catch (error) {
      console.error('Error deleting image files:', error);
    }
  }
}

// Middleware to clean up failed uploads
export const cleanupFailedUploads = (req: Request, res: any, next: any) => {
  const originalSend = res.json;
  
  res.json = function(data: any) {
    // If there's an error and files were uploaded, clean them up
    if (data.success === false && req.files) {
      const files = Array.isArray(req.files) ? req.files : [req.files];
      files.forEach((file: any) => {
        if (file && file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};