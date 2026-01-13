import { Request, Response, NextFunction } from 'express';
import { uploadArticleImage, ImageProcessor, cleanupFailedUploads } from '../../middleware/upload';
import { ApiResponse } from '../../utils/response';
import { AppConfig } from '../../utils/config';
import path from 'path';
import fs from 'fs';

export class UploadController {
  /**
   * POST /api/v1/upload/article/image
   * Upload single or multiple images for articles
   */
  static uploadArticleImages = [
    cleanupFailedUploads,
    uploadArticleImage.array('images', 5), // Allow up to 5 images
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const files = req.files as Express.Multer.File[];
        
        if (!files || files.length === 0) {
          return res.status(400).json(
            ApiResponse.error('No files uploaded', 400)
          );
        }

        // Process each uploaded image
        const processedImages = await Promise.all(
          files.map(async (file) => {
            try {
              const urls = await ImageProcessor.processArticleImage(file.path, file.filename);
              
              return {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                urls
              };
            } catch (error) {
              console.error(`Error processing image ${file.filename}:`, error);
              // Delete the failed file
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
              throw new Error(`Failed to process image: ${file.originalname}`);
            }
          })
        );

        const response = ApiResponse.success(
          {
            images: processedImages,
            count: processedImages.length
          },
          'Images uploaded and processed successfully'
        );

        res.json(response);
      } catch (error) {
        console.error('Upload error:', error);
        
        // Clean up any uploaded files on error
        if (req.files) {
          const files = Array.isArray(req.files) ? req.files : [req.files];
          files.forEach((file: any) => {
            if (file && file.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }

        next(error);
      }
    }
  ];

  /**
   * DELETE /api/v1/upload/article/image
   * Delete article image and all its variants
   */
  static async deleteArticleImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json(
          ApiResponse.error('Image URL is required', 400)
        );
      }

      await ImageProcessor.deleteArticleImages(imageUrl);

      const response = ApiResponse.success(
        null,
        'Image deleted successfully'
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/upload/article/gallery
   * Get list of uploaded article images
   */
  static async getArticleGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const uploadsDir = path.join(process.cwd(), 'uploads', 'articles');
      
      if (!fs.existsSync(uploadsDir)) {
        return res.json(
          ApiResponse.success({
            images: [],
            total: 0,
            page: Number(page),
            limit: Number(limit),
            totalPages: 0
          }, 'No images found')
        );
      }

      // Recursively get all images
      const images: any[] = [];
      const baseUrl = AppConfig.baseUrl;

      const scanDirectory = (dir: string, relativePath: string = '') => {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            scanDirectory(fullPath, path.join(relativePath, item));
          } else if (stats.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(item)) {
            const relativeFilePath = path.join('articles', relativePath, item);
            images.push({
              filename: item,
              path: relativeFilePath,
              url: `${baseUrl}/uploads/${relativeFilePath.replace(/\\/g, '/')}`,
              size: stats.size,
              uploadedAt: stats.birthtime,
              modifiedAt: stats.mtime
            });
          }
        });
      };

      scanDirectory(uploadsDir);

      // Sort by upload date (newest first)
      images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      // Paginate
      const startIndex = (Number(page) - 1) * Number(limit);
      const endIndex = startIndex + Number(limit);
      const paginatedImages = images.slice(startIndex, endIndex);

      const response = ApiResponse.success({
        images: paginatedImages,
        total: images.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(images.length / Number(limit))
      }, 'Article gallery loaded successfully');

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}