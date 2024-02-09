import mongoose from "mongoose";

const { Schema } = mongoose;

const shortUrlSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fullUrl: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("ShortUrl", shortUrlSchema);
