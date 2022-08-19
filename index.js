const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
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
    id: uuidv4(),
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
          res.json({ data: req.body, message: "success!" });
        }
      );
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const notesList = JSON.parse(data);
      //res.json(notesList);
      for (let i = 0; i < notesList.length; i++) {
        const note = notesList[i];
        if (note.id == req.params.id) {
          console.log(note.id);
          notesList.splice(i, 1);
        }
      }
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(notesList, null, 4),
        (err, data) => {
          if (err) {
            throw err;
          }
          res.json(notesList);
        }
      );
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/404.html"));
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT} 🚀`);
});
