const express = require ("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Listening to the sounds of port ${PORT}`);
  });

  app.get("/js/index.js", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/assets/js/index.js"));
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

  app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });

  app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json","utf8", (err, data) => {
      if (err) {
        throw err;
      } else {
        const notesList = JSON.parse(data);
        res.json(notesList);
      }
    });
  });

  app.post("/api/notes", (req, res) => {
    const newNote = {
      title: req.body.title,
      text: req.body.text,
    };
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        throw err;
      } else {
        console.log(data);
        const notesList = JSON.parse(data);
        notesList.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(notesList, null, 4),
          (err, data) => {
            if (err) {
              throw err;
            }
            res.json({data: req.body, message: "success!" });
          }
        );
      }
    });
  });


  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/404.html"));
})
  