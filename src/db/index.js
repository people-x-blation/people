import pg from 'pg';
let instance;
export class Singleton {
  constructor() {
    if (instance) return instance;

    instance = new pg.Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DATABASE,
      port: process.env.DB_PORT,
    });
    return instance;
  }
}
