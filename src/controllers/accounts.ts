import { Request, Response } from "express";
import { getAccount, getSession, insertAccount } from "../models/accounts";
import { insertSession } from "../models/sessions";
import { Account } from "../types/Account";
import {
  validatePassword,
  validatePublicKey,
  validateToken,
} from "../validators/accounts";
import bcrypt from "bcrypt";
import { Session } from "../types/Session";

export async function login(req: Request, res: Response) {
  const { username, password, publicKey } = req.body;

  // Get account from database
  const account: Account | null = await getAccount(username);

  // Validate account and password
  if (!account || !validatePassword(password, account.password)) {
    // If account doesn't exist, validate password with a dummy hash to prevent timing attacks
    if (!account)
      validatePassword(
        password,
        "$2a$12$rtM7zYKeiBV3.9BdUc468OiHmEoX3vBmkzYuwxezhOclRyGmINBDy"
      );

    res.status(401).send({ error: "Invalid username or password" });
    return;
  }

  // Validate public key
  if (!validatePublicKey(publicKey)) {
    res.status(400).send();
    return;
  }

  // Insert session into database
  const token = await insertSession({
    public_key: publicKey,
    account_id: account.id as number,
  });

  if (!token) {
    res.status(400).send();
    return;
  }

  res.status(200).send({ token });
}

export async function register(req: Request, res: Response) {
  const { username, password }: { username: string; password: string } =
    req.body;

  // Don't allow duplicate usernames
  const account: Account | null = await getAccount(username);

  if (account) {
    res.status(400).send();
    return;
  }

  // Insert account into database
  const account_id: boolean | number = await insertAccount({
    username,
    password: bcrypt.hashSync(password, 12),
  });

  if (!account_id) {
    res.status(401).send();
    return;
  }

  res.status(201).send();
}

export async function session(req: Request, res: Response) {
  const { token } = req.body;

  if (!validateToken(token)) {
    res.status(400).send();
    return;
  }

  const sessionData: Session | null = await getSession(token);

  if (!sessionData) {
    res.status(401).send();
    return;
  }

  const account: Account | null = await getAccount(sessionData.account_id);

  if (!account) {
    res.status(401).send();
    return;
  }

  res.status(200).send({ username: account.username });
}
