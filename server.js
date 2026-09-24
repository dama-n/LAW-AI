import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/law-ai';
const JWT_SECRET = process.env.JWT_SECRET || 'law-ai-dev-secret';

const memoryUsers = [];

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'users' }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: false,
    });
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory auth fallback:', error.message);
    return false;
  }
}

function buildToken(user) {
  return jwt.sign(
    {
      id: user._id ? user._id.toString() : user.id,
      email: user.email,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function normalizeUser(user) {
  return {
    id: user._id ? user._id.toString() : user.id,
    email: user.email,
    fullName: user.fullName,
  };
}

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'mongo' : 'memory' });
});

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, fullName } = req.body || {};

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Email, password, and full name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        passwordHash,
      });

      const token = buildToken(user);
      return res.status(201).json({
        token,
        user: normalizeUser(user),
      });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = memoryUsers.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: `local-${Date.now()}`,
      fullName,
      email: normalizedEmail,
      passwordHash,
    };

    memoryUsers.push(user);
    const token = buildToken(user);
    return res.status(201).json({ token, user: normalizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = buildToken(user);
      return res.status(200).json({ token, user: normalizeUser(user) });
    }

    const normalizedEmail = email.toLowerCase();
    const user = memoryUsers.find((entry) => entry.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = buildToken(user);
    return res.status(200).json({ token, user: normalizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Login failed' });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ user: normalizeUser(user) });
    }

    const user = memoryUsers.find((entry) => entry.id === req.user.id || entry.email === req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: normalizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Could not fetch user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDatabase();
});
