import { getInstance } from "../controller/stream/stream";

const initializeStream = (app: any) => {
  app.use(getInstance);
};
export { initializeStream };
