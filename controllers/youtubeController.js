import "express-async-errors";
import Youtube from "../model/youtubeModel.js";
import { StatusCodes } from "http-status-codes";

export const createYoutube = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const youtube = await Youtube.create(req.body);
  res.status(StatusCodes.CREATED).json({ youtube });
};

export const getAllYoutube = async (req, res) => {
  try {
    const youtubes = await Youtube.find();
    res.status(StatusCodes.OK).json({ youtubes });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const deleteYoutube = async (req, res) => {
  const { id } = req.params;
  const removeYoutube = await Youtube.findByIdAndDelete(id);
  if (!removeYoutube) {
    return res.status(400).json({ msg: `no youtube link with id ${id}` });
  }

  res.status(201).json({
    msg: "Youtube link was deleted succesfully",
    product: removeYoutube,
  });
};
