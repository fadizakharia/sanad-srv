import { Router } from "express";
import {
  currentUser,
  updateUser,
  uploadDriverDocuments,
  uploadIdDocuments,
} from "../controller/user/user";
import multer from "multer";
import { isLoggedIn } from "../util/Authorization";
import { multerS3Config } from "../util/fileUploadToS3";
const multerVerification = multer({
  storage: multerS3Config(),
  dest: "/images",
  limits: { files: 2, fileSize: 5000 },
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  },
});
const router = Router();
router.get("/current", currentUser);
router.put("/", updateUser);
router.post(
  "/id",
  isLoggedIn,
  multerVerification.fields([
    { name: "id_front", maxCount: 1 },
    { name: "id_back", maxCount: 1 },
  ]),
  uploadIdDocuments
);
router.post(
  "/driver-license",
  isLoggedIn,
  multerVerification.fields([
    { name: "driver_license_front", maxCount: 1 },
    { name: "driver_license_back", maxCount: 1 },
  ]),
  uploadDriverDocuments
);
export { router as userRouter };
