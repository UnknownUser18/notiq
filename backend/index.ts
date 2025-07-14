import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';
import 'dotenv/config';


const app = express();

app.use(express.json());

app.use(cookieParser());

const bannedIPs : Map<string, Date> = new Map();

const banDuration = 15 * 60 * 1000; // 15 minutes

if (process.env.HOST === '' || process.env.HOST === undefined)
  throw new Error('Please set the HOST environment variable');

if (process.env.PORT === '' || process.env.PORT === undefined)
  throw new Error('Please set the PORT environment variable');

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://${ process.env.HOST }:${ process.env.PORT }`);
});

app.use(cors({
  origin : [
    `http://${ process.env.ACCEPTED_HOST }`,
    `https://${ process.env.ACCEPTED_HOST }`,
    'http://localhost:4200'
  ],
  credentials : true,
  methods : ['GET', 'POST']
}));
console.log('CORS configured with allowed origins:', [
  `http://${ process.env.ACCEPTED_HOST }`,
  `https://${ process.env.ACCEPTED_HOST }`,
  'http://localhost:4200'
]);
if (process.env.JWT_SECRET_KEY === '' || process.env.JWT_SECRET_KEY === undefined)
  throw new Error('Please set the JWT_SECRET_KEY environment variable');

const SECRET : jwt.Secret = process.env.JWT_SECRET_KEY! as jwt.Secret;

const db = mysql.createConnection({
  host : process.env.DATABASE_HOST,
  user : process.env.DATABASE_USER,
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE_NAME,
});
db.connect((err) => {
  if (err)
    throw new Error('Database connection failed: ' + err.message);
  console.log('Connected to the database!');
});

app.post('/api/auth/login', (req : Request, res : Response) : void => {
  const { username, password, rememberMe } = req.body;
  const ip = req.ip;

  if (!username || !password) {
    res.status(400).json({ message : 'Username and password are required' });
    return;
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ message : 'Username and password must be strings' });
    return;
  }

  if (ip && bannedIPs.has(ip)) {
    res.status(403).json({ message : 'Login rejected due to too many attempts. Please try again later.' });
    return;
  }

  db.query('SELECT EXISTS(SELECT 1 FROM users WHERE username = ? AND password = ?) AS userExists', [username, password], (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      res.status(500).json({ message : 'Internal server error' });
      return;
    }
    const userExists = (results as any)[0]?.userExists === 1;
    if (!userExists) {
      res.status(401).json({ message : 'Invalid username or password' });
      return;
    }
    const token = jwt.sign({ username }, SECRET, rememberMe ? { expiresIn : '30d' } : undefined);

    if (!token) {
      res.status(500).json({ message : 'Failed to create session' });
      return;
    }

    if (!req.cookies) {
      res.status(500).json({ message : 'Cookies are not enabled in the request' });
      return;
    }

    if (!res.cookie) {
      res.status(500).json({ message : 'Response cookie method is not available' });
      return;
    }

    res.cookie('token', token, { httpOnly : true });
    res.status(200).json({ message : 'Login successful', token });
  });
});

app.post('/api/auth/reject-login', (req : Request, res : Response) : void => {
  const ip = req.ip;
  if (!ip) {
    res.status(400).json({ message : 'Error while handling login.' });
    return;
  }
  const currentTime = new Date();
  const banTime = bannedIPs.get(ip);
  if (banTime && currentTime.getTime() - banTime.getTime() < banDuration) {
    bannedIPs.set(ip, banTime);
    console.log(`IP ${ ip } has been banned for ${ banDuration } seconds.`);
    res.status(403).json({ message : 'Login rejected due to too many attempts. Please try again later.' });
    return;
  }
  bannedIPs.set(ip, currentTime);
  console.log(`IP ${ ip } has been banned.`);
  res.status(200).json({ message : 'Login rejected' });
});

setInterval(() => {
  const now = new Date();
  for (const [ip, banTime] of bannedIPs.entries()) {
    if (now.getTime() - banTime.getTime() >= banDuration) {
      bannedIPs.delete(ip);
      console.log(`Ban for IP ${ ip } has been cleared.`);
    }
  }
}, 60 * 1000);

app.post('/api/auth/check-login-status', (req : Request, res : Response) : void => {
  const ip = req.ip;
  if (!ip) {
    res.status(400).json({ message : 'Error while checking login status.' });
    return;
  }
  if (bannedIPs.has(ip)) {
    res.status(403).json({ message : 'Login rejected due to too many attempts. Please try again later.' });
    return;
  } else {
    res.status(200).json({ message : 'User can log in.' });
  }
});

app.post('/api/auth/check-session', (req : Request, res : Response) : void => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message : 'No session found' });
    return;
  }

  jwt.verify(token, SECRET, (err : any, decoded : any) => {
    if (err) {
      res.status(403).json({ message : 'Invalid session' });
      return;
    }
    res.status(200).json({ message : 'Session is valid', username : decoded.username });
  });
});
