import express from "express";
import bodyParser from "body-parser";
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
import { initializeStream } from "./util/Stream";
import { chatRouter } from "./routes/chat";
import { createServer } from "http";
import SocketIO from "socket.io";
import { initializeSocket } from "./util/socket";
import { driverRequestsRouter } from "./routes/driver-request";
export default function app() {
  const app = express();
  const connectionUri = process.env.MONGO_URI;
  const server = createServer(app);
  const io = new SocketIO.Server(server);
  app.use(bodyParser.json());

  app.use(Cors({ credentials: true }));

  initializeStream(app);
  initializePassport(app);
  initializeSocket(app, io);
  app.all("*", RequestLogger);
  app.use("/auth", authRouter);
  app.use("/shipment", shipmentRouter);
  app.use("/user", userRouter);
  app.use("/requests", driverRequestsRouter);
  app.use("/chat", chatRouter);
  io.on("connection", (sock) => {
    sock.on("job-taken", (data) => {
      console.log(data);

      sock.broadcast.emit("job-taken", data);
    });
  });
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
  server
    .listen(3000, async () => {
      console.log("server started on port 3000");

      await mongoose.connect(connectionUri);
    })
    .addListener("error", (err: Error) => {
      console.log(err);
    });
}
