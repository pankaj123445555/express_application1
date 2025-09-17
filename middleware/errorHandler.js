const express = require("express");

const app = express();

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid id format` });
  }

  res.status(500).json({ error: "Something went wrong on our server" });
};

module.exports = errorHandler;
