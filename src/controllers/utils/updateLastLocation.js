import { User } from "../../models/User.model";

export const UpdateLastLocation = async (ipInfo, userId) => {
  let lastLocation = {
    type: "Point",
    coordinates: ipInfo.ll,
  };
  let savedUser = await User.findByIdAndUpdate(
    userId,
    {
      ipInfo,
      lastLocation,
    },
    { new: true }
  );

  return savedUser;
};
