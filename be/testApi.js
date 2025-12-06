const http = require('http');

const data = JSON.stringify({
  email: '222112001@stis.ac.id',
  password: 'mahasiswa123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
