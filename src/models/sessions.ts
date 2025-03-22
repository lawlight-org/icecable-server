import pool from "../database";
import { PoolConnection } from "mariadb";
import { Session } from "../types/Session";
import { generateRandomString } from "../utils/generators";

export async function insertSession({
  public_key,
  account_id,
}: Session): Promise<boolean | string> {
  const conn: PoolConnection = await pool.getConnection();

  let tries = 0;

  const attempt = async () => {
    try {
      const token = generateRandomString(128);
      await conn.query(
        "INSERT INTO sessions (token, public_key, account_id) VALUES (?, ?, ?)",
        [token, public_key, account_id]
      );
      conn.release();
      return token;
    } catch (e) {
      // If the token already exists, try again (up to 5 times)
      if (tries < 5) {
        tries++;
        return attempt();
      } else {
        conn.release();
        return false;
      }
    }
  };

  return attempt();
}
