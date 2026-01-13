/**
 * Application Configuration
 * Centralized configuration management for the Al-Furqon backend
 */

export class AppConfig {
  // Server Configuration
  static get port(): number {
    return parseInt(process.env.PORT || '8080', 10);
  }

  static get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  static get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  static get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  // Base URL Configuration
  static get baseUrl(): string {
    // Prioritas: env.BASE_URL > construct from PORT
    if (process.env.BASE_URL) {
      return process.env.BASE_URL;
    }

    // Fallback: construct from PORT
    const port = this.port;
    const protocol = this.isProduction ? 'https' : 'http';
    const host = process.env.HOST || 'localhost';

    // Untuk production, gunakan domain tanpa port jika port 80/443
    if (this.isProduction && (port === 80 || port === 443)) {
      return `${protocol}://${host}`;
    }

    return `${protocol}://${host}:${port}`;
  }

  // Database Configuration
  static get databaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }

  // JWT Configuration
  static get jwtSecret(): string {
    return process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  }

  static get jwtRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production';
  }

  static get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '1h';
  }

  static get jwtRefreshExpiresIn(): string {
    return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // Upload Configuration
  static get uploadPath(): string {
    return process.env.UPLOAD_PATH || './uploads';
  }

  static get maxFileSize(): number {
    return parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB default
  }

  // CORS Configuration
  static get corsOrigin(): string | string[] {
    const origin = process.env.CORS_ORIGIN ||
                   process.env.FRONTEND_URL ||
                   'http://localhost:3000';

    // Support multiple origins separated by comma
    if (origin.includes(',')) {
      return origin.split(',').map(url => url.trim()).filter(url => url.length > 0);
    }

    return origin;
  }

  // Rate Limiting
  static get rateLimitWindowMs(): number {
    return parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
  }

  static get rateLimitMaxRequests(): number {
    return parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
  }

  // Admin Configuration
  static get adminDefaultEmail(): string {
    return process.env.ADMIN_DEFAULT_EMAIL || 'admin@alfurqon.com';
  }

  static get adminDefaultPassword(): string {
    return process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  }

  static get adminDefaultUsername(): string {
    return process.env.ADMIN_DEFAULT_USERNAME || 'admin';
  }

  // Logging
  static get logLevel(): string {
    return process.env.LOG_LEVEL || 'info';
  }

  static get logFile(): string {
    return process.env.LOG_FILE || './logs/app.log';
  }

  // Optional: Redis
  static get redisUrl(): string | undefined {
    return process.env.REDIS_URL;
  }

  // Optional: AWS S3
  static get awsAccessKeyId(): string | undefined {
    return process.env.AWS_ACCESS_KEY_ID;
  }

  static get awsSecretAccessKey(): string | undefined {
    return process.env.AWS_SECRET_ACCESS_KEY;
  }

  static get awsRegion(): string {
    return process.env.AWS_REGION || 'ap-southeast-1';
  }

  static get awsS3Bucket(): string | undefined {
    return process.env.AWS_S3_BUCKET;
  }

  // Optional: Email
  static get smtpHost(): string | undefined {
    return process.env.SMTP_HOST;
  }

  static get smtpPort(): number | undefined {
    const port = process.env.SMTP_PORT;
    return port ? parseInt(port, 10) : undefined;
  }

  static get smtpUser(): string | undefined {
    return process.env.SMTP_USER;
  }

  static get smtpPass(): string | undefined {
    return process.env.SMTP_PASS;
  }

  static get smtpFrom(): string {
    return process.env.SMTP_FROM || 'noreply@alfurqon.com';
  }
}