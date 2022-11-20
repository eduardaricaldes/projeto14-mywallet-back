import { Router } from "express";
import { users, signIn } from '../controllers/user.controller.js';

const router = Router();

router.get("/sign-up", users)
router.post("/sign-in", signIn);

export default router;