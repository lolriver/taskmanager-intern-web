import http from 'http';

async function test() {
  try {
    // 1. Register a user
    const regRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    console.log('Register status:', regRes.status);
    const regBody = await regRes.json();
    console.log('Register body:', regBody);

    // 2. Fetch the cookie from headers
    const cookie = regRes.headers.get('set-cookie');
    console.log('Cookie:', cookie);

    // 3. Create a task
    const taskRes = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookie || ''
      },
      body: JSON.stringify({
        title: 'My Test Task',
        description: 'Testing task creation',
        status: 'Pending'
      })
    });
    console.log('Task Create status:', taskRes.status);
    const taskBody = await taskRes.json();
    console.log('Task Create body:', taskBody);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
