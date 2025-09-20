#!/bin/bash

echo "🚀 AL-FURQON BACKEND DEPLOYMENT TEST SCRIPT"
echo "==========================================="

# Test Docker containers status
echo "📦 Checking Docker containers..."
docker-compose ps

echo -e "\n🔍 Testing API endpoints..."

# Test health endpoint
echo "1. Health Check:"
response=$(curl -s http://localhost:5001/health)
if [[ $response == *"Al-Furqon Backend is running"* ]]; then
    echo "   ✅ Health endpoint: WORKING"
else
    echo "   ❌ Health endpoint: FAILED"
    echo "   Response: $response"
fi

# Test API v1 health
echo "2. API v1 Health Check:"
response=$(curl -s http://localhost:5001/api/v1/health)
if [[ $response == *"database"*"connected"* ]]; then
    echo "   ✅ API v1 health endpoint: WORKING"
    echo "   ✅ Database connection: CONFIRMED"
else
    echo "   ❌ API v1 health endpoint: FAILED"
    echo "   Response: $response"
fi

# Test articles endpoint
echo "3. Articles API:"
response=$(curl -s http://localhost:5001/api/v1/articles)
if [[ $response == *"Articles loaded successfully"* ]]; then
    echo "   ✅ Articles endpoint: WORKING"
else
    echo "   ❌ Articles endpoint: FAILED"
    echo "   Response: $response"
fi

# Test donations endpoint
echo "4. Donations API:"
response=$(curl -s http://localhost:5001/api/v1/donations)
if [[ $response == *"Donations loaded successfully"* ]]; then
    echo "   ✅ Donations endpoint: WORKING"
else
    echo "   ❌ Donations endpoint: FAILED"
    echo "   Response: $response"
fi

echo -e "\n🌐 Available endpoints:"
echo "   - Health: http://localhost:5001/health"
echo "   - API v1: http://localhost:5001/api/v1/*"
echo "   - Articles: http://localhost:5001/api/v1/articles"
echo "   - Donations: http://localhost:5001/api/v1/donations"
echo "   - News: http://localhost:5001/api/v1/news"

echo -e "\n📊 Container logs (last 5 lines):"
echo "Backend logs:"
docker-compose logs backend --tail=5

echo -e "\nDatabase logs:"
docker-compose logs postgres --tail=5

echo -e "\n🎉 DEPLOYMENT VERIFICATION COMPLETE!"
