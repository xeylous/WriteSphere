const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'sarah@writesphere.com',
      password: 'Password123'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error status:', err.response?.status);
    console.log('Error data:', err.response?.data);
  }
}

test();
