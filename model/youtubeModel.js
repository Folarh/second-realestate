import mongoose from "mongoose";

const YoutubeSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model("Youtube", YoutubeSchema);
