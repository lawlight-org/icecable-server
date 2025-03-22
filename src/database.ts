import mariadb, { Pool } from "mariadb";
import { PoolConnection } from "mariadb";

const pool: Pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

export async function query(
  query: string,
  params: (number | string)[]
): Promise<any> {
  const conn: PoolConnection = await pool.getConnection();
  const result: any = await conn.query(query, params);
  conn.release();
  return result;
}

export default pool;
