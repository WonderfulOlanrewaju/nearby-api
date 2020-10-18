import express from "express";
import { router as AuthControllers } from "./routes/auth.route";
import expressIP from "express-ip";
import { User } from "./models/User.model";
export const app = express();
export const environment = process.env.NODE_ENV;
import { name } from "../package.json";
app.use(expressIP().getIpInfoMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(201).json({
    message: `Hi from ${name}`,
  });
});

app.get("/nearbyusers", async (req, res) => {
  try {
    const { ipInfo } = req;
    let nearByUsers = await User.find({
      lastLocation: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            // coordinates: [6.5279623, 3.3910865999999997],
            coordinates: ipInfo.ll,
          },
          $maxDistance: 100000,
        },
      },
    });
    if (!nearByUsers || nearByUsers.length === 0) {
      res.status(201).json({
        message: "No users near you",
        nearByUser: [],
      });
    } else {
      res.status(201).json({
        message: "Here are users near you",
        nearByUsers,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: `Issues finding nearby users. ${err.message}`,
    });
  }
});

app.use("/api/v1/auth", AuthControllers);
