# Setup PostgreSQL Database
Write-Host "Setting up PostgreSQL Database..." -ForegroundColor Green

# Start PostgreSQL container
Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test database connection
Write-Host "Testing database connection..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://alfurqon_user:alfurqon_password@localhost:5432/alfurqon_db"

# Try to generate Prisma client with retry
$maxRetries = 3
$retryCount = 0

while ($retryCount -lt $maxRetries) {
    Write-Host "Attempting to generate Prisma client (attempt $($retryCount + 1)/$maxRetries)..." -ForegroundColor Yellow
    
    try {
        npx prisma generate
        Write-Host "Prisma client generated successfully!" -ForegroundColor Green
        break
    }
    catch {
        Write-Host "Failed to generate Prisma client. Retrying..." -ForegroundColor Red
        $retryCount++
        Start-Sleep -Seconds 3
        
        if ($retryCount -eq $maxRetries) {
            Write-Host "Failed to generate Prisma client after $maxRetries attempts." -ForegroundColor Red
            Write-Host "You may need to run 'npx prisma generate' manually later." -ForegroundColor Yellow
        }
    }
}

# Create and run migrations
Write-Host "Creating database migrations..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init-postgresql
    Write-Host "Database migrations completed!" -ForegroundColor Green
}
catch {
    Write-Host "Migration failed. Database might not be ready yet." -ForegroundColor Red
    Write-Host "You can run 'npm run prisma:migrate' manually when PostgreSQL is ready." -ForegroundColor Yellow
}

# Run seed if successful
Write-Host "Running database seed..." -ForegroundColor Yellow
try {
    npm run prisma:seed
    Write-Host "Database seeded successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Seeding failed. You can run 'npm run prisma:seed' manually later." -ForegroundColor Yellow
}

Write-Host "Setup completed! You can now run 'npm run dev' to start the application." -ForegroundColor Green