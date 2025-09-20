# Database Switch Script
# Untuk mengganti antara SQLite dan PostgreSQL

Write-Host "=== Database Configuration Switch ===" -ForegroundColor Green
Write-Host ""
Write-Host "Pilihan database:" -ForegroundColor Yellow
Write-Host "1. SQLite (untuk development lokal tanpa Docker)" -ForegroundColor Cyan
Write-Host "2. PostgreSQL (untuk production/dengan Docker)" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Pilih database (1 atau 2)"

switch ($choice) {
    "1" {
        Write-Host "Switching to SQLite..." -ForegroundColor Yellow
        
        # Update schema.prisma ke SQLite
        $schemaContent = Get-Content "prisma/schema.prisma"
        $newSchemaContent = $schemaContent -replace 'provider = "postgresql"', 'provider = "sqlite"'
        $newSchemaContent = $newSchemaContent -replace 'url\s*=\s*env\("DATABASE_URL"\)', 'url      = "file:./dev.db"'
        $newSchemaContent | Set-Content "prisma/schema.prisma"
        
        Write-Host "✅ Schema updated to SQLite" -ForegroundColor Green
        
        # Generate Prisma client
        Write-Host "Generating Prisma client..." -ForegroundColor Yellow
        npx prisma generate
        
        # Migrate database
        Write-Host "Running migrations..." -ForegroundColor Yellow
        npx prisma migrate dev --name sqlite-migration
        
        # Seed database
        Write-Host "Seeding database..." -ForegroundColor Yellow
        npm run prisma:seed
        
        Write-Host "✅ SQLite setup completed!" -ForegroundColor Green
        Write-Host "Run 'npm run dev' to start the application" -ForegroundColor Cyan
    }
    
    "2" {
        Write-Host "Switching to PostgreSQL..." -ForegroundColor Yellow
        
        # Check if Docker is running
        $dockerRunning = $false
        try {
            docker ps | Out-Null
            $dockerRunning = $true
        }
        catch {
            Write-Host "❌ Docker is not running!" -ForegroundColor Red
            Write-Host "Please start Docker Desktop first, then run this script again." -ForegroundColor Yellow
            Write-Host "Or choose option 1 for SQLite instead." -ForegroundColor Yellow
            pause
            exit
        }
        
        if ($dockerRunning) {
            # Update schema.prisma ke PostgreSQL
            $schemaContent = Get-Content "prisma/schema.prisma"
            $newSchemaContent = $schemaContent -replace 'provider = "sqlite"', 'provider = "postgresql"'
            $newSchemaContent = $newSchemaContent -replace 'url\s*=\s*"file:./dev.db"', 'url      = env("DATABASE_URL")'
            $newSchemaContent | Set-Content "prisma/schema.prisma"
            
            Write-Host "✅ Schema updated to PostgreSQL" -ForegroundColor Green
            
            # Start PostgreSQL container
            Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
            docker-compose up -d postgres
            
            # Wait for database
            Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
            
            # Generate Prisma client
            Write-Host "Generating Prisma client..." -ForegroundColor Yellow
            npx prisma generate
            
            # Remove old migrations
            if (Test-Path "prisma/migrations") {
                Remove-Item -Recurse -Force "prisma/migrations"
                Write-Host "✅ Old migrations removed" -ForegroundColor Green
            }
            
            # Create new migration
            Write-Host "Creating PostgreSQL migration..." -ForegroundColor Yellow
            npx prisma migrate dev --name init-postgresql
            
            # Seed database
            Write-Host "Seeding database..." -ForegroundColor Yellow
            npm run prisma:seed
            
            Write-Host "✅ PostgreSQL setup completed!" -ForegroundColor Green
            Write-Host "Run 'npm run dev' to start the application" -ForegroundColor Cyan
        }
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run the script again and choose 1 or 2." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Configuration Summary ===" -ForegroundColor Green
if ($choice -eq "1") {
    Write-Host "Database: SQLite (file:./dev.db)" -ForegroundColor Cyan
    Write-Host "No Docker required" -ForegroundColor Cyan
} elseif ($choice -eq "2") {
    Write-Host "Database: PostgreSQL (localhost:5432)" -ForegroundColor Cyan
    Write-Host "Docker container: postgres" -ForegroundColor Cyan
}
Write-Host ""