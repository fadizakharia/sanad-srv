import { Request, Response, NextFunction } from "express";

import { CustomError } from "../../util/Error";

import { updateUserValidationSchema } from "./validation/update";
import User from "../../model/user";
import { validationError } from "../../util/ErrorType";
import { extractFilesFromKey } from "../../helpers/file.helper";
import verificationDocuments from "../../model/verification-documents";
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError("Something went wrong!", 500);
  try {
    console.log(req.user);

    if (req.user) {
      res.send({
        user: req.user,
      });
    } else {
      error.message = "user is not signed in!";
      error.status = 405;
      throw error;
    }
  } catch (err) {
    return next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const error = new CustomError("Somethign went wrong!", 500);
    let validationErrors: validationError[] = [];
    if (!req.user) {
      error.message = "user is not logged in!";
      error.status = 405;
      throw error;
    }

    await updateUserValidationSchema
      .validate({ ...req.body }, { abortEarly: false })
      .catch(function (err) {
        err.inner.forEach((e: any) => {
          validationErrors = [
            ...validationErrors,
            { field: e.path, message: e.message },
          ];
        });
      });
    if (validationErrors.length > 0) {
      error.setValidationErrors(...validationErrors);
      error.status = 400;
      error.message = "Invalid Input!";
      throw error;
    }
    const updatedUser = await User.updateOne(
      { id: req.user.id },
      { ...req.body }
    );
    if (updatedUser.acknowledged) {
      res.send({ status: true });
    } else {
      throw error;
    }
  } catch (err) {
    return next(err);
  }
};

export const uploadIdDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError("Something went wrong!", 500);
  try {
    const foundUser = await User.findById(req.user.id);
    let foundVerificationDocuments = await verificationDocuments.findOne({
      user: req.user.id,
    });
    if (!foundUser) {
      throw error;
    }
    const idFrontLocation = (extractFilesFromKey(req, "id_front")[0] as any)
      .location;
    const idBackLocation = (extractFilesFromKey(req, "id_back")[0] as any)
      .location;

    if (!foundVerificationDocuments) {
      foundVerificationDocuments = await verificationDocuments.create({
        id_front: idFrontLocation,
        id_back: idBackLocation,
        user: foundUser,
      });
      foundUser.verification = foundVerificationDocuments;
      await foundUser.save();
    } else {
      foundVerificationDocuments.id_front = idFrontLocation;
      foundVerificationDocuments.id_back = idBackLocation;

      await foundVerificationDocuments.save();
    }
    res.send(foundVerificationDocuments);
  } catch (err) {
    return next(err);
  }
};
export const uploadDriverDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError("Something went wrong!", 500);
  try {
    const foundUser = await User.findById(req.user.id);
    let foundVerificationDocuments = await verificationDocuments.findOne({
      user: req.user.id,
    });
    if (!foundUser) {
      throw error;
    }
    const driverLicenseFrontLocation = (
      extractFilesFromKey(req, "driver_license_front")[0] as any
    ).location;
    const driverLicenseBackLocation = (
      extractFilesFromKey(req, "driver_license_back")[0] as any
    ).location;

    if (!foundVerificationDocuments) {
      foundVerificationDocuments = await verificationDocuments.create({
        driving_license_front: driverLicenseFrontLocation,
        driving_license_back: driverLicenseBackLocation,
        user: foundUser,
      });
      foundUser.verification = foundVerificationDocuments;
      await foundUser.save();
    } else {
      foundVerificationDocuments.driving_license_front =
        driverLicenseFrontLocation;
      foundVerificationDocuments.driving_license_back =
        driverLicenseBackLocation;
      await foundVerificationDocuments.save();
    }
    res.send(foundVerificationDocuments);
  } catch (err) {
    return next(err);
  }
};
