const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/urlModel");
const { urlencoded } = require("express");
const app = express();
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to mongo db");
  })
  .catch((err) => {
    console.log("Error connecting to mongo db");
  });

app.set("view engine", "ejs");
app.use(urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("home", { shortUrls: shortUrls });
});

app.post("/createURL", async (req, res) => {
  await ShortUrl.create({ longUrl: req.body.longUrl });

  res.redirect("/");
});

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const data = await ShortUrl.findOne({ shortUrl: shortId });

  if (data == null) return res.sendStatus(404);

  data.views++;
  data.save();

  res.redirect(data.longUrl);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
