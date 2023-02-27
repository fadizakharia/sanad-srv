import { Router } from "express";
import { getTokenHandler } from "../controller/chat/chat";
import { isLoggedIn } from "../util/Authorization";

const router = Router();

router.get("/token", isLoggedIn, getTokenHandler);

export { router as chatRouter };
