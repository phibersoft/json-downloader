const express = require("express");
const axios = require("axios"); // For fetching data (alternatives : xmlhttprequest, fetch etc..)
const uniqid = require("uniqid"); // Just for live website, filenames must be unique
const fs = require("fs"); // NodeJS File System

const app = express();
const PORT = process.env.PORT || 3400;

app.set("view engine", "ejs"); // Its view engine used for client side. You can use handlebars etc.

app.use(express.static("public")); // Reachable folder by everyone

app.get("/", (req, res) => {
  res.render("index"); // Now ejs system rendering views/index.ejs
});
app.get("/g", (req, res) => {
  res.render("download", { link: "Http://localhost:3400/json...." });
});
app.get("/download", async (req, res) => {
  const { url } = req.query;
  const response = await axios
    .get(url)
    .then((result) => {
      // if status 200
      const data = result.data; // get the data
      const fileName = uniqid(); // give a unique name
      fs.appendFile(
        // create a file
        `./public/${fileName}.json`, // filename
        JSON.stringify(data), // data
        (err) => {
          // error handling
          res.status(500).json({
            success: false,
            message: "Its not your fault! Can u try again?",
          });
        }
      );
      res.render("download", {
        // if everything success, render the views/download.ejs
        link: `http://localhost:3400/${fileName}.json`, // give a variable. You can view ejs documents.
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("http://localhost:3400/error");
    });
});

app.get("/error", (req, res) => {
  res.render("error");
});
app.listen(PORT, () => {
  console.log(`Server is running on localhost:${PORT}`);
});
