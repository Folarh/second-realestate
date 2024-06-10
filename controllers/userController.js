// user.js
import User from "../model/User.js";

export const showLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
