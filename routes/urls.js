import {
  createShortUrl,
  getListOfCreatedUrl,
  getFullUrl,
  editUrl,
  removeUrl,
  removeAllUrl,
} from "../controllers/urls.js";
import express from "express";
import { session } from "../middlewares/session.js";

const router = express.Router();
router.get("/list", session, getListOfCreatedUrl);
router.post("/", session, createShortUrl);
router.get("/:shortUrl", getFullUrl);
router.patch("/:urlId", session, editUrl);
router.delete("/:urlId", session, removeUrl);
router.delete("/", session, removeAllUrl);
export default router;
