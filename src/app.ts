import express from "express";
import { json } from "body-parser";
import Cors from "cors";
import mongoose from "mongoose";
import cron from "node-cron";
import initializePassport from "./util/strategies";
import { errorHandler, errorLogger } from "./controller/Error";
import { authRouter } from "./routes/auth";
import { shipmentRouter } from "./routes/shipment";
import { userRouter } from "./routes/user";
import { RequestLogger } from "./util/RequestLogger";
import shipment from "./model/shipment";
import Moment from "moment";
export default function app() {
  const app = express();
  const connectionUri = process.env.MONGO_URI;

  app.use(json());
  app.use(Cors({ credentials: true }));

  initializePassport(app);
  app.all("*", RequestLogger);
  app.use("/auth", authRouter);
  app.use("/shipment", shipmentRouter);
  app.use("/user", userRouter);
  cron.schedule("0/5 * * * *", async (now) => {
    await shipment.updateMany(
      {
        delivery_date: { $gte: Moment(now).toDate() },
        status: { $ne: "fulfilled" },
      },
      { $set: { status: "delayed" } }
    );
  });

  app.use(errorLogger);
  app.use(errorHandler);
  app
    .listen(3000, async () => {
      console.log("server started on port 3000");

      await mongoose.connect(connectionUri);
    })
    .addListener("error", (err: Error) => {
      console.log(err);
    });
}
