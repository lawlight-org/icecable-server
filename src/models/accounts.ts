import { Account } from "../types/Account";
import { query } from "../database";
import { Session } from "../types/Session";

export async function insertAccount({
  username,
  password,
}: Account): Promise<boolean | number> {
  const insertAcc: any = await query(
    "INSERT INTO accounts (username, password) VALUES (?, ?)",
    [username, password]
  );

  if (insertAcc.affectedRows > 0) {
    return insertAcc.insertId;
  } else {
    return false;
  }
}

export async function getAccount(id: string | number): Promise<Account | null> {
  const account = await query(
    `SELECT id, username, password FROM accounts WHERE ${
      typeof id === "number" ? "id" : "username"
    } = ?`,
    [id]
  );

  if (account.length === 1) {
    return account[0];
  } else {
    return null;
  }
}

export async function getSession(token: string): Promise<Session | null> {
  const session = await query(
    "SELECT token, public_key, account_id FROM sessions WHERE token = ?",
    [token]
  );

  if (session.length === 1) {
    return session[0];
  } else {
    return null;
  }
}
