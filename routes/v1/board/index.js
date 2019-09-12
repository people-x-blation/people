import { Router } from "express";
import isValidate from "~/lib/validate";
const router = new Router();

import * as boardCtrl from "./index.ctrl";

router.get(
  "/write",
  (req, res, next) => isValidate(req, res, next),
  boardCtrl.write
);
router.post("/upload", boardCtrl.upload);
router.get("/read/:boardnum", boardCtrl.read);
router.get("/search", boardCtrl.search);
router.get("/", boardCtrl.boardlist);
router.get("/:location", boardCtrl.boardlist);

router.post("/comment_upload", boardCtrl.comment_upload);
router.post("/comment_destroy", boardCtrl.comment_destroy);
router.post("/participate", boardCtrl.participate);

export default router;
