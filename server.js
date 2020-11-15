const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path');
const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

// html routes
app.get("/exercise", (_req, res) => {
 res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", (_req, res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
   });

// api routes
app.put("/api/workouts/:id", (req, res) => {
    db.Workout.findByIdAndUpdate(
        req.params.id, { $push: { exercises: req.body } }, { new: true, runValidators: true }
        )   
    .then(data => {
            console.log(data);
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

app.post("/api/workouts", (req, res) => {
  db.Workout.create({})
    .then(data => {
        res.json(data);})
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({}).limit(7).then(data => res.json(data))
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
