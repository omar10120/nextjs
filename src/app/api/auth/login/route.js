import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { signToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Find user in database
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0]; // Grab the first user if found

    // Check if user exists
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
  
    // Generate JWT
    const token = signToken({ id: user.id, username: user.username });

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error(error); // Log full error for debugging
    console.log("JWT_SECRET from environment:", process.env.JWT_SECRET);
    const test = process.env.JWT_SECRET;

    return new Response(JSON.stringify({ error: 'Login failed: ' + error.message + "Test:" + test}), { status: 500 });
  }
}
