import express from "express";

import { logIn, register } from "../controllers/users.mjs";
const router = express.Router();
router.post("/signin", logIn);
router.post("/signup", register);
export default router;
