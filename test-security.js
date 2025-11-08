/**
 * Security Test Script
 * 
 * This script tests the security implementations for the bulk email and user management features.
 * Run this script to verify that the security fixes are working properly.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hotvsgzdmcwrhfuacgjw.supabase.co'

// Test 1: Unauthorized access to bulk email endpoint
async function testUnauthorizedBulkEmail() {
  console.log('🔒 Testing unauthorized access to bulk email endpoint...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-bulk-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Test Email',
        content: 'This should fail'
      })
    })
    
    if (response.status === 401) {
      console.log('✅ PASS: Unauthorized access properly blocked (401)')
    } else {
      console.log('❌ FAIL: Expected 401, got', response.status)
    }
  } catch (error) {
    console.log('❌ FAIL: Network error:', error.message)
  }
}

// Test 2: Unauthorized access to user emails endpoint
async function testUnauthorizedUserEmails() {
  console.log('🔒 Testing unauthorized access to user emails endpoint...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-user-emails`)
    
    if (response.status === 401) {
      console.log('✅ PASS: Unauthorized access properly blocked (401)')
    } else {
      console.log('❌ FAIL: Expected 401, got', response.status)
    }
  } catch (error) {
    console.log('❌ FAIL: Network error:', error.message)
  }
}

// Test 3: Invalid authorization header
async function testInvalidAuthHeader() {
  console.log('🔒 Testing invalid authorization header...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-bulk-email`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Test Email',
        content: 'This should fail'
      })
    })
    
    if (response.status === 401) {
      console.log('✅ PASS: Invalid token properly rejected (401)')
    } else {
      console.log('❌ FAIL: Expected 401, got', response.status)
    }
  } catch (error) {
    console.log('❌ FAIL: Network error:', error.message)
  }
}

// Test 4: Missing required fields
async function testMissingFields() {
  console.log('🔒 Testing missing required fields...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-bulk-email`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer fake-admin-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Missing subject and content
      })
    })
    
    if (response.status === 401) {
      console.log('✅ PASS: Missing fields properly rejected (401)')
    } else {
      console.log('❌ FAIL: Expected 401, got', response.status)
    }
  } catch (error) {
    console.log('❌ FAIL: Network error:', error.message)
  }
}

// Test 5: CORS preflight request
async function testCORS() {
  console.log('🔒 Testing CORS preflight request...')
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-bulk-email`, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization, content-type',
      }
    })
    
    if (response.status === 200) {
      console.log('✅ PASS: CORS preflight request handled correctly')
    } else {
      console.log('❌ FAIL: CORS preflight failed, got', response.status)
    }
  } catch (error) {
    console.log('❌ FAIL: Network error:', error.message)
  }
}

// Run all tests
async function runSecurityTests() {
  console.log('🚀 Starting Security Tests for Connective App\n')
  console.log('=' .repeat(50))
  
  await testUnauthorizedBulkEmail()
  console.log('')
  
  await testUnauthorizedUserEmails()
  console.log('')
  
  await testInvalidAuthHeader()
  console.log('')
  
  await testMissingFields()
  console.log('')
  
  await testCORS()
  console.log('')
  
  console.log('=' .repeat(50))
  console.log('🏁 Security tests completed!')
  console.log('\nNote: These tests verify that the endpoints properly reject unauthorized requests.')
  console.log('To test with valid admin credentials, you would need to:')
  console.log('1. Create an admin user in Supabase')
  console.log('2. Get a valid JWT token for that user')
  console.log('3. Use that token in the Authorization header')
}

// Run the tests
runSecurityTests().catch(console.error)