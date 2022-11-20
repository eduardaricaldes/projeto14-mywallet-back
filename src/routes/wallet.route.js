import { Router } from "express";
import { auth } from '../middlewares/auth.middleware.js';
import { wallet, getWallet } from '../controllers/wallet.controller.js';

const router = Router();

router.get("/wallet", auth, getWallet)
router.post("/wallet", auth, wallet);

export default router;