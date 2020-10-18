import { app } from "./app";
import mongoose from "mongoose";
let port = process.env.PORT || 7070;

mongoose.connect(process.env.DB || "mongodb://localhost/nearby-api", {
  useNewUrlParser: true,
  useFindAndModify: false,
  autoIndex: false,
  useCreateIndex: true,
});

mongoose.connection.once("open", () => console.log("db connected!"));
mongoose.connection.on("error", (err) => console.log(err));

app.listen(process.env.PORT || 7070, process.env.IP, () =>
  console.log(`nearby-api running on port ${port}`)
);
