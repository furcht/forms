const express = require("express");
const router = express.Router();
const path = require("path");

const sass = require("sass");
const result = sass.compile(path.join(__dirname, "../styles/main.scss"), { "style": "compressed", "sourceMap": true});

router.route("/")
    .get((req, res) => {
        res.set("Content-Type", "text/css");
        res.send(result.css);
    });

module.exports = router;