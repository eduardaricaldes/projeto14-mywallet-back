import { Router } from "express";
import { users, signIn, logout } from '../controllers/user.controller.js';

const router = Router();

router.post("/sign-up", users)
router.post("/sign-in", signIn);
router.get("/logout", logout)

export default router;