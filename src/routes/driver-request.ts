import { Router } from "express";
import {
  acceptDriverRequest,
  addDriverRequest,
  updateDeliveryStatus,
  getRequestedDeliveriesForDriver,
  getRequestedDeliveriesForShipment,
  rejectDriverRequest,
} from "../controller/driver-request/driver-request";

import { isLoggedIn } from "../util/Authorization";

const router = Router();
router.get("/driver", isLoggedIn, getRequestedDeliveriesForDriver);
router.get("/:shipmentId", isLoggedIn, getRequestedDeliveriesForShipment);
router.put("/accept", isLoggedIn, acceptDriverRequest);
router.put("/reject", isLoggedIn, rejectDriverRequest);
router.post("/", isLoggedIn, addDriverRequest);
router.put("/driver/:status", isLoggedIn, updateDeliveryStatus);
export { router as driverRequestsRouter };
