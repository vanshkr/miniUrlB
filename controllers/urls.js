import ShortUrlModel from "../models/shortURLSchema.js";
import dotenv from "dotenv";
dotenv.config();
export const getListOfCreatedUrl = async (req, res) => {
  const { userId } = req;
  if (!userId) {
    return res
      .status(400)
      .json({ message: "UserId is missing in the request. " });
  }
  try {
    const shortUrlList = await ShortUrlModel.find({
      userId: userId,
      isDeleted: false,
    });

    return res.status(200).json({ urlList: shortUrlList });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createShortUrl = async (req, res) => {
  const host = req.get("host");
  let { fullURL, alias } = req?.body;
  const { userId } = req;
  if (!fullURL) {
    return res
      .status(400)
      .json({ message: "Parameter is missing in the request. " });
  } else if (typeof fullURL !== "string") {
    return res.status(400).json({
      message: "Invalid input type. ",
    });
  } else if (!isValidUrl(fullURL)) {
    return res.status(400).json({ message: "Provided URL is not valid. " });
  }
  if (alias && (alias.length > 15 || alias.length < 7)) {
    return res
      .status(400)
      .json({ message: "Provided alias does not match length criteria. " });
  }

  if (!alias) {
    alias = generateRandomString();
  }
  try {
    await ShortUrlModel.create({
      userId: userId,
      fullUrl: fullURL,
      alias: alias,
    });
    const shortUrlString = req.protocol + "://" + host + "/url/" + alias;
    console.log;
    return res.status(200).json({ shortUrl: shortUrlString });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFullUrl = async (req, res) => {
  const { shortUrl } = req?.params;
  if (!shortUrl) {
    return res
      .status(400)
      .json({ message: "Parameter is missing in the request. " });
  } else if (typeof shortUrl !== "string") {
    return res.status(400).json({
      message: "Invalid input type. ",
    });
  }
  try {
    const result = await ShortUrlModel.findOne({
      alias: shortUrl,
    });
    if (!result) return res.status(404).json({ message: "Url not found. " });

    result.clicks++;
    result.save();
    res.redirect(result.fullUrl);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. " });
  }
};

export const editUrl = async (req, res) => {
  const updatedURLData = req?.body;
  const { urlId } = req?.params;

  if (!urlId || !updatedURLData) {
    return res
      .status(400)
      .json({ message: "Parameter is missing in the request. " });
  } else if (typeof urlId !== "string" || typeof updatedURLData !== "object") {
    return res.status(400).json({
      message: "Invalid input type. ",
    });
  }
  if (
    updatedURLData?.alias &&
    (updatedURLData?.alias.length > 15 || updatedURLData?.alias.length < 7)
  ) {
    res
      .status(400)
      .json({ message: "Provided alias does not match length criteria. " });
  } else if (!isValidUrl(updatedURLData?.fullURL)) {
    res.status(400).json({ message: "Provided URL is not valid. " });
  }

  if (!updatedURLData?.alias) {
    let temp = generateRandomString();
    updatedURLData = { ...updatedURLData, alias: temp };
  }
  try {
    const result = await ShortUrlModel.findOneAndUpdate(
      { _id: urlId, userId: req.userId },
      { ...updatedURLData },
      { new: true }
    );
    await result.save();
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const removeUrl = async (req, res) => {
  const { urlId } = req?.params;
  const { userId } = req;
  try {
    const result = await ShortUrlModel.findOneAndUpdate(
      { _id: urlId, userId: userId },
      { isDeleted: true }
    );
    if (!result) {
      res.status(404).json({ message: "URL does not exist. " });
    }

    res.status(200).json({ message: "Url has been deleted successfully. " });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const removeAllUrl = async (req, res) => {
  const { userId } = req;
  try {
    const result = await ShortUrlModel.updateMany(
      { userId: userId },
      { isDeleted: true }
    );
    if (!result) {
      res.status(404).json({ message: "Nothing to clear. " });
    }

    res.status(200).json({ message: "Deletion successful. " });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
function generateRandomString() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const minLength = 7;
  const maxLength = 15;
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

function isValidUrl(string) {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}
