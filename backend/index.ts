import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';
import 'dotenv/config';

const app = express();

app.use(express.json());

app.use(cookieParser());


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
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database!');
});

const loginHandler = (req : Request, res : Response) : void => {
  console.log('Login request received:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message : 'Username and password are required' });
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
      console.warn('Invalid login attempt for username:', username);
      res.status(401).json({ message : 'Invalid username or password' });
      return;
    }
    console.log('User logged in:', username);
    const token = jwt.sign({ username }, SECRET, { expiresIn : '1h' });

    res.cookie('token', token, { httpOnly : true });
    res.status(200).json({ message : 'Login successful' });
  });
};

app.post('/api/auth/login', loginHandler);
