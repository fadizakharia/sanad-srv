import { Request, Response, NextFunction } from "express";
import { ValidationError } from "yup";
import shipment from "../../model/shipment";
import { CustomError } from "../../util/Error";
import { addShipmentDTO } from "./shipment.dto";
import addShipmentSchema from "./validation/add-shipment";
import { sanitiseObject } from "../../util/sanitisation";

import { allowedStatusChange } from "../../util/Authorization";
import { extractFilesFromKey } from "../../helpers/file.helper";

export const getShipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;
  const error = new CustomError("Something went wrong!", 500);
  try {
    const foundShipment = await shipment.findById(id);
    if (!foundShipment) {
      error.message = "shipment not found";
      error.status = 404;
      throw error;
    }
    res.send({ shipment: foundShipment });
  } catch (err) {
    return next(err);
  }
};

export const getNearbyShipments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const error = new CustomError("Something went wrong!", 500);
  const errors: { field: string; message: string }[] = [];
  const { lat1, lng1, lat2, lng2, page = "0", skip = "5", type } = req.query;
  try {
    if (!user) {
      error.message = "user is not logged in!";
      error.status = 405;
      throw error;
    }
    const sanitisedShipmentInformation = sanitiseObject({
      lat1,
      lng1,
      lat2,
      lng2,
      page,
      skip,
      type,
    });
    const shipmentParams = Object.keys(sanitisedShipmentInformation);

    shipmentParams.forEach((param) => {
      if (
        !["lat1", "lng1", "lat2", "lng2", "page", "skip", "type"].includes(
          param
        )
      )
        error.message =
          "The following parameters need to be supplied: lat1, lng1, page and skip.";
      error.status = 400;
      errors.push({ field: param, message: `${param} is missing` });
    });
    if (errors.length > 0) {
      error.setValidationErrors(...errors);
      throw error;
    }
    let shipmentQuery;
    if (!lat2 || !lng2) {
      if (!type) {
        shipmentQuery = shipment.find({
          location: { $geoNear: { near: [+lat1, +lng1], spherical: true } },
          status: "parked",
          page: +page,
          skip: +skip,
        });
      } else {
        shipmentQuery = shipment.find({
          location: { $geoNear: { near: [+lat1, +lng1], spherical: true } },
          status: "parked",
          page: +page,
          skip: +skip,
          shipment_type: type,
        });
      }
    } else {
      if (!type) {
        shipmentQuery = shipment.find({
          from: {
            $geoNear: { near: [+lat1, +lng1], spherical: true },
          },
          to: {
            $geoNear: { near: [+lat2, +lng2], spherical: true },
          },
          status: "parked",
          page: +page,
          skip: +skip,
        });
      } else {
        shipmentQuery = shipment.find({
          from: {
            $geoNear: { near: [+lat1, +lng1], spherical: true },
          },
          to: {
            $geoNear: { near: [+lat2, +lng2], spherical: true },
          },
          status: "parked",
          page: +page,
          skip: +skip,
          shipment_type: type,
        });
      }
    }

    const shipmentCount = await shipmentQuery.count();
    const hasNext = (shipmentCount / +page) * +skip;

    if (!hasNext) {
      error.message = "No shipments found!";
      error.status = 404;
      throw error;
    }

    const foundShipments = await shipmentQuery;

    res.send({
      shipments: foundShipments,
      meta: {
        pagination: {
          page,
          skip,
          hasNext,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};
export const getDriverShipmentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user;
  const { expired = 0, page = 0, skip = 10 } = req.params;
  const isExpired = Boolean(+expired);
  try {
    let foundShipmentsQuery;
    if (!isExpired) {
      foundShipmentsQuery = shipment.find({
        host: currentUser.id,
        status: { $and: [{ $ne: "fulfilled" }, { $ne: "unfulfilled" }] },
        page,
        skip,
      });
    } else {
      foundShipmentsQuery = shipment.find({
        host: currentUser.id,
        status: { $or: [{ $eq: "fulfilled" }, { $eq: "unfulfilled" }] },
        page: +page,
        skip: +skip,
      });
    }
    const foundShipments = await foundShipmentsQuery;
    const foundShipmentsCount = await foundShipmentsQuery.count();
    const hasNext = (foundShipmentsCount / +page) * +skip;
    res.send({
      shipments: foundShipments,
      meta: {
        pagination: {
          page,
          skip,
          hasNext,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};
export const getHostShipmentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user;
  const { expired = 0, page = 0, skip = 10 } = req.params;
  const isExpired = Boolean(+expired);
  try {
    let foundShipmentsQuery;
    if (!isExpired) {
      foundShipmentsQuery = shipment.find({
        host: currentUser.id,
        status: { $and: [{ $ne: "fulfilled" }, { $ne: "unfulfilled" }] },
        page,
        skip,
      });
    } else {
      foundShipmentsQuery = shipment.find({
        host: currentUser.id,
        status: { $or: [{ $eq: "fulfilled" }, { $eq: "unfulfilled" }] },
        page: +page,
        skip: +skip,
      });
    }
    const foundShipments = await foundShipmentsQuery;
    const foundShipmentsCount = await foundShipmentsQuery.count();
    const hasNext = (foundShipmentsCount / +page) * +skip;
    res.send({
      shipments: foundShipments,
      meta: {
        pagination: {
          page,
          skip,
          hasNext,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};
export const addShipmentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shipmentInformation: addShipmentDTO = req.body;
  const sanitisedShipmentInformation = sanitiseObject({
    ...shipmentInformation,
  });
  try {
    const errors: Array<{ field: string; message: string }> = [];
    const error = new CustomError("something went wrong!", 500);
    const currentUser = req.user;
    console.log(req.body);

    addShipmentSchema
      .validate({ ...sanitisedShipmentInformation }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((field: any) => {
          errors.push({ field: field.path, message: field.message });
        });
      });
    if (errors.length > 0) {
      error.message = "Provided information is not valid";
      error.status = 400;
      error.setValidationErrors(...errors);
      throw error;
    }
    const shipmentImageLocation = (
      extractFilesFromKey(req, "shipment_image")[0] as any
    ).location;
    const fromLocationSanitised = {
      type: "Point",
      coordinates: [
        +sanitisedShipmentInformation["from_lat"],
        +sanitisedShipmentInformation["from_lng"],
      ],
    };
    const toLocationSanitised = {
      type: "Point",
      coordinates: [
        +sanitisedShipmentInformation["to_lat"],
        +sanitisedShipmentInformation["to_lng"],
      ],
    };
    const routeLocationSanitised = {
      type: "LineString",
      multi_coordinates: [
        [
          +sanitisedShipmentInformation["from_lat"],
          +sanitisedShipmentInformation["from_lng"],
        ],
        [
          +sanitisedShipmentInformation["to_lat"],
          +sanitisedShipmentInformation["to_lng"],
        ],
      ],
    };
    const createdShipment = new shipment({
      ...sanitisedShipmentInformation,
      from_addr: sanitisedShipmentInformation["from_addr"],
      to_addr: sanitisedShipmentInformation["to_addr"],
      from: fromLocationSanitised,
      route: routeLocationSanitised,
      to: toLocationSanitised,
      host: currentUser,
      image: shipmentImageLocation,
    });
    const addedShipment = await createdShipment.save();

    res.send({ shipment: addedShipment.toObject() });
  } catch (err) {
    return next(err);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, status } = req.body;
  const currentUser = req.user;
  const error = new CustomError("Something went wrong!", 500);
  try {
    const foundShipment = await shipment.findById(id);
    if (foundShipment.host === currentUser.id) {
      const allowedActionsCustomer = allowedStatusChange(
        foundShipment.status,
        "customer"
      );
      if (!allowedActionsCustomer.includes(status)) {
        error.message = "forbidden action";
        error.status = 403;
        throw error;
      }
    } else {
      const allowedActionsDriver = allowedStatusChange(
        foundShipment.status,
        "driver"
      );
      if (!allowedActionsDriver.includes(status)) {
        error.message = "forbidden action";
        error.status = 403;
        throw error;
      }
    }
    foundShipment.status = status;
    res.send({ status: true });
    await foundShipment.save();
  } catch (err) {
    return next(err);
  }
};
