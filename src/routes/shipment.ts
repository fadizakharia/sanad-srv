import { Router } from "express";
import {
  addShipmentHandler,
  getNearbyShipments,
  getDriverShipmentsHandler,
  getHostShipmentsHandler,
  updateStatus,
  getShipment,
} from "../controller/shipment/shipment";
import { isLoggedIn } from "../util/Authorization";

const router = Router();
router.get("/driver/", isLoggedIn, getDriverShipmentsHandler);
router.get("/host/", isLoggedIn, getHostShipmentsHandler);
router.get("/:id/", isLoggedIn, getShipment);
router.get("/", isLoggedIn, getNearbyShipments);
router.post("/", isLoggedIn, addShipmentHandler);
router.put("/:id", isLoggedIn, updateStatus);

export { router as shipmentRouter };
