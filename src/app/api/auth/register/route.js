import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    // If any rows are returned, the user already exists
    if (existingUsers && existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Registration failed' + error }), { status: 500 });
  }
}

// Handle GET requests to fetch all products
export async function GET(request) {


  try {
    const [users] = await db.query('SELECT * FROM users');
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to fetch users' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

