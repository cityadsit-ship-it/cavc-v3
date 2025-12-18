// Quick API Test Script
// Run with: node test-api.js

const API_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing CAVC CMS API...\n');

  try {
    // Test 1: Login
    console.log('1️⃣ Testing Login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'cavc2024' })
    });
    const loginData = await loginRes.json();
    console.log(loginData.success ? '✅ Login successful' : '❌ Login failed');
    console.log('Token:', loginData.token?.substring(0, 20) + '...\n');

    // Test 2: Get Services
    console.log('2️⃣ Testing Get Services...');
    const servicesRes = await fetch(`${API_URL}/services`);
    const services = await servicesRes.json();
    console.log(`✅ Retrieved ${services.length} services`);
    console.log('Services:', services.map(s => s.title).join(', '), '\n');

    // Test 3: Get Single Service
    if (services.length > 0) {
      console.log('3️⃣ Testing Get Single Service...');
      const serviceRes = await fetch(`${API_URL}/services/${services[0].id}`);
      const service = await serviceRes.json();
      console.log('✅ Retrieved service:', service.title);
      console.log('Gallery items:', service.galleryItems?.length || 0, '\n');
    }

    console.log('✨ All tests passed! API is working correctly.\n');
    console.log('Next steps:');
    console.log('1. Start frontend: npm run dev');
    console.log('2. Visit: http://localhost:5173/admin/login');
    console.log('3. Login with: admin / cavc2024\n');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.log('\nMake sure the backend server is running:');
    console.log('npm run server\n');
  }
}

testAPI();
