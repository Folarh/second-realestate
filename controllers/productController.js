import "express-async-errors";
import Product from "../model/productModel.js";
import { StatusCodes } from "http-status-codes";
import uploadImages from "../utils/uploadImage.js";

export const getProductsByCategory = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  if (!category) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Category is required" });
  }

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;

  try {
    const products = await Product.find({ category })
      .skip(skip)
      .limit(pageSize);

    // Count the total number of products with the specified category
    const totalProducts = await Product.countDocuments({ category });

    const numOfPages = Math.ceil(totalProducts / pageSize);

    res.status(StatusCodes.OK).json({
      totalProducts,
      numOfPages,
      currentPage: pageNumber,
      limit: pageSize,
      products,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong while fetching products" });
  }
};

export const createProduct = async (req, res) => {
  const imageFiles = req.files;
  const createdBy = req.user.userId;

  if (!imageFiles || imageFiles.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No files uploaded" });
  }

  // 1. Upload the images to Cloudinary
  const imageUrls = await uploadImages(imageFiles);

  // 2. If upload was successful, add the URLs to the new product
  const newProductData = {
    ...req.body,
    imageUrls: imageUrls, // Correct field name
    createdBy: createdBy,
    createdAt: new Date(),
  };
  const product = await Product.create(newProductData);

  res.status(StatusCodes.CREATED).json({ product });
};

// export const createProduct = async (req, res) => {
//   req.body.createdBy = req.user.userId;
//   const product = await Product.create(req.body);
//   res.status(StatusCodes.CREATED).json({ product });
// };

//wors

//TO GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  const {
    search,
    productStatus,
    category,
    location,
    address,
    name,
    type,
    beds,
    sort,
  } = req.query;

  // Initialize queryObject
  const queryObject = {};

  // If the user is authenticated, add createdBy to the queryObject
  if (req.user) {
    queryObject.createdBy = req.user.userId;
  }

  if (search) {
    queryObject.$or = [
      { address: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { productStatus: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } },
      { beds: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ];
  }

  if (productStatus && productStatus !== "all") {
    queryObject.productStatus = productStatus;
  }
  if (category && category !== "all") {
    queryObject.category = category;
  }

  if (address && address !== "all") {
    queryObject.address = address;
  }

  if (location && location !== "all") {
    queryObject.location = location;
  }
  if (type && type !== "all") {
    queryObject.type = type;
  }
  if (beds && beds !== "all") {
    queryObject.beds = beds;
  }

  if (name && name !== "all") {
    queryObject.name = name;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "price",
    "z-a": "-price",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalProducts / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalProducts, limit, numOfPages, currentPage: page, products });
};

///TO GET SINGLE PRODUCTS
export const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(StatusCodes.OK).json({ msg: `no product with id ${id}` });
  }
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const imageFiles = req.files;

  try {
    // Fetch the existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product with id ${productId}` });
    }

    // Update fields with the new data from req.body
    const updatedData = req.body;
    Object.keys(updatedData).forEach((key) => {
      existingProduct[key] = updatedData[key];
    });

    // Handle image upload if there are new images
    if (imageFiles && imageFiles.length > 0) {
      // Upload new images to Cloudinary
      const newImageUrls = await uploadImages(imageFiles);

      // Merge existing and new image URLs
      existingProduct.imageUrls = [
        ...existingProduct.imageUrls,
        ...newImageUrls,
      ];
    }

    // Save the updated product
    const updatedProduct = await existingProduct.save();

    res.status(StatusCodes.OK).json({ updatedProduct });
  } catch (error) {
    logger.error("Error updating product:", { error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const removeProduct = await Product.findByIdAndDelete(id);
  if (!removeProduct) {
    return res.status(400).json({ msg: `no product with id ${id}` });
  }

  res
    .status(200)
    .json({ msg: "Product was deleted succesfully", product: removeProduct });
};
