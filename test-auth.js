const http = require('http');
const https = require('https');
const url = require('url');

function makeRequest(urlString, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(urlString);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        
        const requestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.path,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = protocol.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    json: () => Promise.resolve(JSON.parse(data))
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

async function testAuth() {
    try {
        console.log('Testing auth endpoint...');
        const response = await makeRequest('http://localhost:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@alfurqon.com',
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (data.data && data.data.token) {
            const token = data.data.token;
            console.log('\n--- Testing video creation with token ---');
            
            const videoResponse = await makeRequest('http://localhost:5000/api/v1/admin/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: 'Test Video',
                    description: 'Test Description',
                    youtubeUrl: 'https://youtube.com/watch?v=test',
                    category: 'kajian'
                })
            });

            const videoData = await videoResponse.json();
            console.log('Video creation status:', videoResponse.status);
            console.log('Video creation data:', JSON.stringify(videoData, null, 2));
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAuth();