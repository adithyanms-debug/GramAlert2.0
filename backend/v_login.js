import axios from 'axios';

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
            username: 'testadmin@example.com',
            password: 'password123',
            type: 'admin'
        });
        console.log('Login Successful:', response.data);
    } catch (error) {
        console.log('Login Failed:', error.response ? error.response.data : error.message);
    }
}

testLogin();
