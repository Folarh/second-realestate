import mongoose from "mongoose";

const YoutubeSchema = new mongoose.Schema({
  name: [
    {
      type: String,
      default: "youtube.com/meandyou?",
    },
  ],
});

export default mongoose.model("Youtube", YoutubeSchema);
