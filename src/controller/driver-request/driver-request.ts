import { Request, Response, NextFunction } from "express";
import shipment from "../../model/shipment";
import { CustomError } from "../../util/Error";
import Moment from "moment";
import { statusTypes, TStatusType } from "../../constants/status-types";
export const acceptDriverRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const error = new CustomError("Something went wrong!", 500);
  const { shipmentId, driverId } = req.body;
  try {
    const foundShipment = await shipment.findById(shipmentId);
    if (!foundShipment) {
      error.status = 404;
      error.message = "shipment does not exist!";
      throw error;
    }
    if (foundShipment.host.toString() !== user._id) {
      error.status = 405;
      error.message = "you are not authorized to perform this action!";
      throw error;
    }
    const driverIndex = foundShipment.driver_requests.indexOf(driverId);
    console.log(driverIndex);

    if (driverIndex < 0) {
      error.status = 405;
      error.message = "you are not authorized to perform this action!";
      throw error;
    }

    const deletetdRequest = foundShipment.driver_requests.splice(
      driverIndex,
      1
    );
    foundShipment.driver = deletetdRequest[0];
    foundShipment.status = "ongoing";
    const savedShipment = await foundShipment.save();
    res.send({ shipment: savedShipment });
  } catch (err) {
    return next(err);
  }
};
export const rejectDriverRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const error = new CustomError("Something went wrong!", 500);
  const { shipmentId, driverId } = req.body;
  try {
    const foundShipment = await shipment.findById(shipmentId);
    if (!foundShipment) {
      error.status = 404;
      error.message = "shipment does not exist!";
      throw error;
    }
    if (foundShipment.host.toString() !== user._id) {
      error.status = 405;
      error.message = "you are not authorized to perform this action!";
      throw error;
    }
    const driverIndex = foundShipment.driver_requests.indexOf(driverId);
    console.log(driverIndex);

    if (driverIndex < 0) {
      error.status = 405;
      error.message = "you are not authorized to perform this action!";
      throw error;
    }

    foundShipment.driver_requests.splice(driverIndex, 1);
    const savedShipment = await foundShipment.save();
    res.send({ shipment: savedShipment });
  } catch (err) {
    return next(err);
  }
};
export const addDriverRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const driver = req.user;
  const { shipmentId } = req.body;
  const error = new CustomError("Something went wrong!", 500);
  try {
    const foundShipment = await shipment.findById(shipmentId);
    if ((foundShipment.driver_requests as Array<string>).includes(driver.id)) {
      error.status = 405;
      error.message = "driver has already requested to deliver!";
      throw error;
    }
    (foundShipment.driver_requests as Array<string>).push(driver._id);
    await foundShipment.save();
    res.send({ shipment: foundShipment });
  } catch (err) {
    return next(err);
  }
};
export const getRequestedDeliveriesForDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const driver = req.user;
  const { archived } = req.query;
  const status = archived;
  try {
    let driverQuery = shipment.find({
      driver_requests: driver.id,
      delivery_date: { $lt: Moment(Moment.now()).toDate() },
    });

    if (!status || status === "false") {
      driverQuery = shipment.find({
        driver_requests: driver.id,
        delivery_date: { $gte: Moment(Moment.now()).toDate() },
      });
    }
    const foundDriverShipments = await driverQuery;
    res.send({ shipments: foundDriverShipments });
  } catch (err) {
    return next(err);
  }
};
export const getRequestedDeliveriesForShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { shipmentId } = req.params;
  const host = req.user;

  const error = new CustomError("Something went wrong!", 500);
  try {
    const foundShipment = await shipment
      .findById(shipmentId)
      .populate("driver_requests");

    if (foundShipment.host.toString() !== host._id) {
      error.status = 405;
      error.message = "You are not allowed to perform this action!";
      throw error;
    }
    res.send({ drivers: foundShipment.driver_requests });
  } catch (err) {
    return next(err);
  }
};
export const updateDeliveryStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const driver = req.user;
  const { status } = req.params;
  const { shipmentId } = req.body;
  const error = new CustomError("Something went wrong!", 500);
  try {
    const foundShipment = await shipment.findById(shipmentId);
    if (!status) {
      error.status = 400;
      error.message = "status was not provided";
      throw error;
    }
    if (!statusTypes.includes(status as string)) {
      error.status = 405;
      error.message = "status is not allowed";
      throw error;
    }
    if (!foundShipment) {
      error.status = 404;
      error.message = "Shipment does not exist!";
      throw error;
    }
    if (foundShipment.driver !== driver._id) {
      error.status === 405;
      error.message = "you are not authorized to perform this action!";
      throw error;
    }
    foundShipment.status = status as TStatusType;
    const savedShipment = await foundShipment.save();
    res.send({ shipment: savedShipment.toObject() });
  } catch (err) {
    return next(err);
  }
};
