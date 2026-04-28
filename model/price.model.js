import mongoose from "mongoose";

const stateChargeSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true,
    },
    charge: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const priceSchema = new mongoose.Schema(
  {
    gst: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    stateCharges: {
      type: [stateChargeSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Price", priceSchema);