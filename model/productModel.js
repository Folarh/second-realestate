import mongoose from "mongoose";
import {
  PRODUCT_STATUS,
  PRODUCT_CATEGORY,
  PRODUCT_TYPE,
  PRODUCT_BEDS,
  PRODUCT_BATHROOMS,
} from "../utils/constants.js";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    oldPrice: Number,
    price: Number,
    description: String,
    landSize: String,

    youtubeLink: String,
    location: String,
    productStatus: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.NEW,
    },

    bathroom: {
      type: Number,
      enum: Object.values(PRODUCT_BATHROOMS),
      default: PRODUCT_BATHROOMS.ONE,
    },

    beds: {
      type: Number,
      enum: Object.values(PRODUCT_BEDS),
      default: PRODUCT_BEDS.ONE,
    },

    imageUrls: [{ type: String, default: "/uploads/example.jpeg" }],
    features: [{ type: String }],
    title: String,

    category: {
      type: String,
      enum: Object.values(PRODUCT_CATEGORY),
      default: PRODUCT_CATEGORY.SALE,
    },
    type: {
      type: String,
      enum: Object.values(PRODUCT_TYPE),
      default: PRODUCT_TYPE.SHOP,
    },

    garage: Number,

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
