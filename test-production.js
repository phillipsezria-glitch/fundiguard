#!/usr/bin/env node

/**
 * FundiGuard Production API Test Suite
 * Tests: https://fundiguard.vercel.app -> https://api.fundiguard.ke
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
    
    // Check CORS headers
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

    // Try to parse body
    try {
      const body = JSON.parse(response.body);
      log('green', `   ✅ Response: ${JSON.stringify(body, null, 2)}`);
    } catch {
      if (response.body) {
        log('yellow', `   ℹ️  Response (not JSON): ${response.body.substring(0, 100)}`);
      }
    }

    return { success: true, status: response.status };
  } catch (error) {
    log('red', `   ❌ Error: ${error.error || error.message}`);
    log('red', `   Code: ${error.code}`);
    return { success: false, error: error.error };
  }
}

async function testPreflight(url) {
  log('cyan', `\n📍 Testing CORS Preflight: ${url}`);

  try {
    const response = await makeRequest(url, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://fundiguard.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });

    log('green', `   ✅ Preflight Status: ${response.status}`);
    
    const corsOrigin = response.headers['access-control-allow-origin'];
    const corsMethods = response.headers['access-control-allow-methods'];
    const corsHeaders = response.headers['access-control-allow-headers'];

    if (corsOrigin) {
      log('green', `   ✅ Allow-Origin: ${corsOrigin}`);
    } else {
      log('red', `   ❌ No Allow-Origin header!`);
    }

    if (corsMethods) {
      log('green', `   ✅ Allow-Methods: ${corsMethods}`);
    }

    if (corsHeaders) {
      log('green', `   ✅ Allow-Headers: ${corsHeaders}`);
    }

    return { success: true };
  } catch (error) {
    log('red', `   ❌ Preflight Error: ${error.error}`);
    return { success: false };
  }
}

async function runTests() {
  log('blue', '\n╔════════════════════════════════════════════════════════════╗');
  log('blue', '║     FundiGuard Production API Test Suite                   ║');
  log('blue', '║     Frontend: https://fundiguard.vercel.app                 ║');
  log('blue', '║     Backend: https://api.fundiguard.ke                      ║');
  log('blue', '╚════════════════════════════════════════════════════════════╝');

  const results = [];

  // Test 1: General Health Check
  results.push(await testEndpoint(
    'General Health Check',
    'https://api.fundiguard.ke/health'
  ));

  // Test 2: Auth Health Check
  results.push(await testEndpoint(
    'Auth Service Health',
    'https://api.fundiguard.ke/api/auth/health'
  ));

  // Test 3: CORS Preflight for Login
  results.push(await testPreflight(
    'https://api.fundiguard.ke/api/auth/login'
  ));

  // Test 4: Login Endpoint (will fail with 401 but should not be 405)
  results.push(await testEndpoint(
    'Login Endpoint',
    'https://api.fundiguard.ke/api/auth/login',
    {
      method: 'POST',
      body: {
        phone_number: '+254712345678',
        password: 'test',
      },
    }
  ));

  // Test 5: CORS Preflight for Jobs
  results.push(await testPreflight(
    'https://api.fundiguard.ke/api/jobs'
  ));

  // Test 6: Jobs List
  results.push(await testEndpoint(
    'Jobs List',
    'https://api.fundiguard.ke/api/jobs?page=1&limit=10'
  ));

  // Test 7: Test API URL from frontend perspective
  log('cyan', '\n📍 Testing: Frontend API Configuration');
  log('blue', '   Attempting to fetch from frontend origin');

  try {
    const response = await makeRequest('https://api.fundiguard.ke/health', {
      headers: {
        'Origin': 'https://fundiguard.vercel.app',
      },
    });
    
    const corsOrigin = response.headers['access-control-allow-origin'];
    
    if (corsOrigin === 'https://fundiguard.vercel.app' || corsOrigin === '*') {
      log('green', `   ✅ Frontend can access backend`);
      log('green', `   ✅ CORS Origin: ${corsOrigin}`);
    } else {
      log('yellow', `   ⚠️  CORS Origin: ${corsOrigin} (not fundiguard.vercel.app)`);
    }

    results.push({ success: true, status: response.status });
  } catch (error) {
    log('red', `   ❌ Error: ${error.error}`);
    results.push({ success: false, error: error.error });
  }

  // Summary
  log('blue', '\n╔════════════════════════════════════════════════════════════╗');
  log('blue', '║                      TEST SUMMARY                          ║');
  log('blue', '╚════════════════════════════════════════════════════════════╝');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  log('green', `\n✅ Passed: ${successful}/${results.length}`);
  if (failed > 0) {
    log('red', `❌ Failed: ${failed}/${results.length}`);
  }

  // Specific error checking
  log('cyan', '\n🔍 Error Analysis:');

  const has405 = results.some(r => r.status === 405);
  const hasCors = results.some(r => r.error && r.error.includes('CORS'));

  if (has405) {
    log('red', '   ❌ Found 405 errors - endpoint method not allowed');
    log('yellow', '   Possible causes:');
    log('yellow', '      - Endpoint path mismatch');
    log('yellow', '      - HTTP method mismatch (GET vs POST)');
  } else {
    log('green', '   ✅ No 405 errors found');
  }

  if (hasCors) {
    log('red', '   ❌ Found CORS errors - frontend cannot access backend');
    log('yellow', '   Fix: Update CORS config in backend');
  } else {
    log('green', '   ✅ CORS appears to be configured correctly');
  }

  // Recommendations
  log('cyan', '\n💡 Recommendations:');
  log('blue', '   1. If you see 405 errors: Check endpoint paths in API_PATHS_DEBUG.md');
  log('blue', '   2. If CORS fails: Verify FRONTEND_URL env var on backend');
  log('blue', '   3. If 401: That\'s normal - credentials are needed');
  log('blue', '   4. Check browser DevTools (F12 → Network) for live requests');

  log('cyan', '\n📋 Next Steps:');
  log('blue', '   1. Review results above');
  log('blue', '   2. Fix any issues found');
  log('blue', '   3. Redeploy backend: git push origin main');
  log('blue', '   4. Redeploy frontend: git push origin main');
  log('blue', '   5. Test again in browser');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  log('red', `\n❌ Test suite error: ${err.message}`);
  process.exit(1);
});
