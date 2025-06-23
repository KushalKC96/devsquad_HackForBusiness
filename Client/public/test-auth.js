// Test registration and login to get real token
console.log('Testing registration and login...');

async function registerAndLogin() {
    try {
        // Clear any existing auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('kostra_user');
        
        const API_BASE_URL = 'http://localhost:5000';
        
        // Test user data
        const userData = {
            firstName: 'Test',
            lastName: 'Host',
            email: 'testhost@example.com',
            password: 'password123',
            role: 'host'
        };
        
        console.log('1. Attempting to register user...');
        
        // Register user
        const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!registerResponse.ok) {
            const errorData = await registerResponse.json();
            if (errorData.message && errorData.message.includes('already exists')) {
                console.log('User already exists, attempting login...');
                
                // Try to login instead
                const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userData.email,
                        password: userData.password
                    })
                });
                
                if (!loginResponse.ok) {
                    throw new Error('Login failed: ' + await loginResponse.text());
                }
                
                const loginData = await loginResponse.json();
                console.log('✅ Login successful!');
                
                // Store auth data
                localStorage.setItem('auth_token', loginData.data.token);
                localStorage.setItem('kostra_user', JSON.stringify(loginData.data.user));
                
                return {
                    success: true,
                    user: loginData.data.user,
                    token: loginData.data.token,
                    message: 'Logged in existing user successfully'
                };
            } else {
                throw new Error('Registration failed: ' + errorData.message);
            }
        }
        
        const registerData = await registerResponse.json();
        console.log('✅ Registration successful!');
        
        // Store auth data
        localStorage.setItem('auth_token', registerData.data.token);
        localStorage.setItem('kostra_user', JSON.stringify(registerData.data.user));
        
        return {
            success: true,
            user: registerData.data.user,
            token: registerData.data.token,
            message: 'Registered new user successfully'
        };
        
    } catch (error) {
        console.error('❌ Auth error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the test
registerAndLogin().then(result => {
    console.log('Auth test result:', result);
    if (result.success) {
        console.log('✅ Ready to test property publishing with real auth token!');
        console.log('User:', result.user);
        console.log('Token stored in localStorage');
    }
});
