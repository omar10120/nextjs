import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    res.status(200).json({ message: 'Protected content', userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
