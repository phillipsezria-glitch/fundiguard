# Test Backend Endpoints
$baseUrl = "http://localhost:3001"

Write-Host "Testing Backend Endpoints" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

# Health Check
Write-Host "1. Health Check:" -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    Write-Host $health.Content -ForegroundColor Green
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Request OTP
Write-Host "2. Request OTP for Register:" -ForegroundColor Cyan
try {
    $body = @{
        phone_number = "254712345678"
        action = "register"
    } | ConvertTo-Json
    
    $otp = Invoke-WebRequest -Uri "$baseUrl/api/auth/request-otp" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host $otp.Content -ForegroundColor Green
}
catch {
    $errorResponse = $_.ErrorDetails.Message
    Write-Host "Error Response: $errorResponse" -ForegroundColor Yellow
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

Write-Host ""

# Get Jobs (should fail without auth)
Write-Host "3. Verify OTP & Register:" -ForegroundColor Cyan
try {
    $body = @{
        phone_number = "254712345678"
        otp_code = "747462"
        action = "register"
        full_name = "John Doe"
        role = "client"
    } | ConvertTo-Json
    
    $verify = Invoke-WebRequest -Uri "$baseUrl/api/auth/verify-otp" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    Write-Host $verify.Content -ForegroundColor Green
    
    # Extract the token
    $response = $verify.Content | ConvertFrom-Json
    $token = $response.token
    Write-Host "Token obtained: $($token.Substring(0,20))..." -ForegroundColor Green
    
    # Use the token for next request
    Write-Host ""
    Write-Host "4. Get Jobs with Auth:" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $jobs = Invoke-WebRequest -Uri "$baseUrl/api/jobs" -Headers $headers -UseBasicParsing
    Write-Host $jobs.Content -ForegroundColor Green
}
catch {
    $errorResponse = $_.ErrorDetails.Message
    Write-Host "Error Response: $errorResponse" -ForegroundColor Yellow
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Backend Testing Complete!" -ForegroundColor Green
