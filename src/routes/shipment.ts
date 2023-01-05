import { Router } from "express";
import {
  addShipmentHandler,
  getNearbyShipments,
  getDriverShipmentsHandler,
  getHostShipmentsHandler,
  updateStatus,
  getShipment,
} from "../controller/shipment/shipment";
import multer from "multer";
import { isLoggedIn } from "../util/Authorization";
import { multerS3Config } from "../util/fileUploadToS3";
const multerVerification = multer({
  storage: multerS3Config(),
  dest: "/images",
  limits: { files: 2 },
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
router.get("/driver/", isLoggedIn, getDriverShipmentsHandler);
router.get("/host/", isLoggedIn, getHostShipmentsHandler);
router.get("/:id/", isLoggedIn, getShipment);
router.get("/", isLoggedIn, getNearbyShipments);
router.post(
  "/",
  isLoggedIn,
  multerVerification.fields([{ name: "shipment_image", maxCount: 1 }]),
  addShipmentHandler
);
router.put("/:id", isLoggedIn, updateStatus);

export { router as shipmentRouter };
