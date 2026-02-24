# Test Backend with Supabase Integration
$baseUrl = "http://localhost:3001"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$lastSix = $timestamp.Substring($timestamp.Length - 6)
$testPhone = "254798$lastSix"

Write-Host "Testing Backend with Supabase Integration" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Register with password
Write-Host "Step 1: Register new user with Supabase" -ForegroundColor Cyan
Write-Host "Phone: $testPhone" -ForegroundColor Gray
try {
    $body = @{
        phone_number = $testPhone
        password = "SecurePass123"
        full_name = "Test User"
        role = "client"
    } | ConvertTo-Json
    
    $register_response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    
    $user_data = $register_response.Content | ConvertFrom-Json
    $token = $user_data.token
    $user = $user_data.user
    
    Write-Host "User registered successfully" -ForegroundColor Green
    Write-Host "  User ID: $($user.id)" -ForegroundColor Green
    Write-Host "  Name: $($user.full_name)" -ForegroundColor Green
    Write-Host "  Role: $($user.role)" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0,30))..." -ForegroundColor Green
}
catch {
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Step 2: Test authenticated endpoint (Get Jobs)" -ForegroundColor Cyan
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $jobs_response = Invoke-WebRequest -Uri "$baseUrl/api/jobs" `
        -Headers $headers -UseBasicParsing
    
    $jobs_data = $jobs_response.Content | ConvertFrom-Json
    Write-Host "Authenticated request successful" -ForegroundColor Green
    Write-Host "  Jobs found: $($jobs_data.total)" -ForegroundColor Green
}
catch {
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing Complete" -ForegroundColor Green
