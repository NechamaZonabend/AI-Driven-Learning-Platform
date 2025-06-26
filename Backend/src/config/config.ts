import dotenv from 'dotenv';

dotenv.config();

interface Config {
  openaiApiKey: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;
}

const config: Config = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '1d',
  databaseUrl: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb',
};


export default config;