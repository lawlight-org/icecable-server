import { validateSHA256 } from "../validators/accounts";
import { Request, Response, NextFunction } from "express";

export function validateCredentials() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!validateSHA256(username) || !validateSHA256(password)) {
      res.status(400).send();
      return;
    }

    next();
  };
}
