import Price from "../model/price.model.js";


// ================= CREATE PRICE =================
export const createPrice = async (req, res) => {
  try {
    const { gst, stateCharges } = req.body;

    let parsedStateCharges = [];

    if (stateCharges) {
      parsedStateCharges =
        typeof stateCharges === "string"
          ? JSON.parse(stateCharges)
          : stateCharges;
    }

    const price = new Price({
      gst,
      stateCharges: parsedStateCharges,
    });

    const saved = await price.save();

    return res.status(201).json({
      success: true,
      message: "Price created successfully",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET ALL =================
export const getAllPrices = async (req, res) => {
  try {
    const prices = await Price.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET BY ID =================
export const getPriceById = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: price,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= UPDATE FULL (SAFE FIX) =================
export const updatePrice = async (req, res) => {
  try {
    const updateData = {};

    // ✅ ONLY update fields if they exist (PREVENT DATA LOSS)
    if (req.body.gst !== undefined) {
      updateData.gst = req.body.gst;
    }

    if (req.body.stateCharges !== undefined) {
      updateData.stateCharges =
        typeof req.body.stateCharges === "string"
          ? JSON.parse(req.body.stateCharges)
          : req.body.stateCharges;
    }

    const updated = await Price.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },   // 🔥 IMPORTANT FIX
      { new: true }
    );

    return res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= UPDATE GST ONLY =================
export const updateGST = async (req, res) => {
  try {
    const updated = await Price.findByIdAndUpdate(
      req.params.id,
      { $set: { gst: req.body.gst } }, // 🔥 SAFE UPDATE
      { new: true }
    );

    return res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= UPDATE STATE CHARGE =================
export const updateStateCharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { index, state, charge } = req.body;

    const price = await Price.findById(id);

    if (!price) {
      return res.status(404).json({
        success: false,
        message: "Price not found",
      });
    }

    // ❗ SAFETY CHECK
    if (!price.stateCharges[index]) {
      return res.status(400).json({
        success: false,
        message: "Invalid state index",
      });
    }

    // ✅ UPDATE ONLY ONE ITEM (NO OVERWRITE)
    price.stateCharges[index] = {
      state,
      charge,
    };

    await price.save();

    return res.json({
      success: true,
      message: "State updated successfully",
      data: price,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= DELETE =================
export const deletePrice = async (req, res) => {
  try {
    const deleted = await Price.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Price not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};