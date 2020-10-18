import Mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
let { connection, Schema } = Mongoose;
autoIncrement.initialize(connection);

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const UserSchema = new Schema({
  firstName: {
    type: String,
    min: 2,
    default: "",
  },
  lastName: { type: String, default: "" },
  email: { type: String, unique: true },
  address: { type: String, default: "" },
  password: { type: String, default: "" },
  ipInfo: {
    ip: { type: String, default: "" },
    range: { type: Array, default: [] },
    country: { type: String, default: "" },
    region: { type: String, default: "" },
    eu: { type: String, default: "" },
    city: { type: String, default: "" },
    ll: { type: Array },
    metro: Number,
    area: Number,
  },
  lastLocation: {
    type: pointSchema,
    default: {
      type: "Point",
      coordinates: [0, 0],
    },
    index: "2dsphere",
  },
});

UserSchema.plugin(autoIncrement.plugin, {
  startAt: 1,
  incrementBy: 1,
  model: "User",
});

export const User = Mongoose.model("User", UserSchema);
