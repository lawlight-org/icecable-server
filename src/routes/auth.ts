import express, { Router } from "express";
import { login, session, register } from "../controllers/accounts";
import { validateCredentials } from "../middlewares/credentials";

const router: Router = Router();
router.use(express.json());

router.post("/me", session);

router.use(validateCredentials());
router.post("/register", register);
router.post("/login", login);

export default router;
