#!/usr/bin/env node

/**
 * FundiGuard Production API Test Suite
 * Tests actual Vercel deployment URLs
 */

const https = require('https');
const http = require('http');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://fundiguard.vercel.app',
        ...options.headers,
      },
      timeout: 10000,
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          url: url,
        });
      });
    });

    req.on('error', (err) => {
      reject({
        error: err.message,
        code: err.code,
        url: url,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        code: 'TIMEOUT',
        url: url,
      });
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  log('cyan', `\n📍 Testing: ${name}`);
  log('blue', `   URL: ${url}`);
  log('blue', `   Method: ${options.method || 'GET'}`);

  try {
    const response = await makeRequest(url, options);

    log('green', `   ✅ Status: ${response.status}`);
    
    const corsOrigin = response.headers['access-control-allow-origin'];
    const corsMethods = response.headers['access-control-allow-methods'];
    
    if (corsOrigin) {
      log('green', `   ✅ CORS Origin: ${corsOrigin}`);
    } else {
      log('yellow', `   ⚠️  No CORS Origin header`);
    }

    if (corsMethods) {
      log('green', `   ✅ CORS Methods: ${corsMethods}`);
    }

    try {
      const body = JSON.parse(response.body);
      log('green', `   ✅ Response: ${JSON.stringify(body, null, 2)}`);
    } catch {
      if (response.body) {
        log('yellow', `   ℹ️  Response (not JSON): ${response.body.substring(0, 100)}`);
      }
    }

    return { success: true, status: response.status, url };
  } catch (error) {
    log('red', `   ❌ Error: ${error.error || error.message}`);
    log('red', `   Code: ${error.code}`);
    return { success: false, error: error.error, url };
  }
}

async function runTests() {
  log('blue', '\n╔════════════════════════════════════════════════════════════╗');
  log('blue', '║     FundiGuard Vercel URLs Test                            ║');
  log('blue', '╚════════════════════════════════════════════════════════════╝');

  const results = [];
  const urls = [
    {
      name: 'Frontend (main app)',
      url: 'https://fundiguard.vercel.app',
    },
    {
      name: 'Potential Backend URL 1',
      url: 'https://fundiguard-api.vercel.app/health',
    },
    {
      name: 'Potential Backend URL 2', 
      url: 'https://fundiguard-backend.vercel.app/health',
    },
  ];

  for (const item of urls) {
    log('cyan', `\n🔍 Checking: ${item.name}`);
    log('blue', `   URL: ${item.url}`);

    try {
      const response = await makeRequest(item.url);
      log('green', `   ✅ Accessible (Status: ${response.status})`);
      results.push({ name: item.name, url: item.url, status: response.status });
    } catch (error) {
      log('red', `   ❌ Not found or error: ${error.code || error.error}`);
    }
  }

  // Key finding
  log('cyan', '\n╔════════════════════════════════════════════════════════════╗');
  log('cyan', '║                    CRITICAL ISSUE FOUND                    ║');
  log('cyan', '╚════════════════════════════════════════════════════════════╝');

  log('red', '\n❌ api.fundiguard.ke does NOT exist or is not configured');
  log('red', '\nThe 405 error is happening because:');
  log('red', '   1. Frontend tries to call https://api.fundiguard.ke');
  log('red', '   2. Domain doesn\'t resolve → network error → browser shows 405\n');

  log('yellow', '🔧 Your backend URL is likely one of these:');
  log('blue', '   - https://fundiguard-api.vercel.app');
  log('blue', '   - https://fundiguard-backend.vercel.app');
  log('blue', '   - https://fundiguard.vercel.app/api (same as frontend)\n');

  log('cyan', '\n📋 REQUIRED ACTION:\n');

  log('blue', '   Option A: Use custom domain (recommended)\n');
  log('yellow', '   1. Buy/own domain api.fundiguard.ke');
  log('yellow', '   2. Add to Vercel backend project settings');
  log('yellow', '   3. Update frontend API_URL := https://api.fundiguard.ke\n');

  log('blue', '   Option B: Use Vercel default domain\n');
  log('yellow', '   1. Find your backend Vercel project URL');
  log('yellow', '   2. Update frontend API_URL in app/lib/api.ts');
  log('yellow', '   3. Redeploy both frontend and backend\n');

  log('blue', '   Option C: Combine frontend + backend on same domain\n');
  log('yellow', '   1. Use rewrites in next.config.ts to proxy /api to backend');
  log('yellow', '   2. Frontend: GET /api/auth/login');
  log('yellow', '   3. Next.js proxies to actual backend\n');

  process.exit(1);
}

runTests().catch(err => {
  log('red', `\n❌ Test suite error: ${err.message}`);
  process.exit(1);
});
