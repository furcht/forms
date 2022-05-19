// ### IMPORTS ### //
const express = require("express");
const app = express();
const path = require("path");

// ### VARIABLES ### //
let port = 8080;

// ### CONFIGS ### //
app.use(express.json()); //- json decoder
app.use(express.urlencoded({extended: true})); //- url encoder
app.use(express.static(path.join(__dirname,"/_public"))); //- static files
app.set("views", path.join(__dirname,"/views")); //- path to view files
app.set("view engine", "pug"); //- view engine

// ### ROUTES ### //
var cssRoute = require(path.join(__dirname,"/routes/css.route"));
app.use("/css", cssRoute);
var indexRoute = require(path.join(__dirname,"/routes/index.route"));
app.use(indexRoute);

// ### ERROR HANDLING ### //
//- 404 not found
app.use((req, res) => {
    res.status(404).send('Not Found');
})
//- 500 catch-all
app.use((err, req, res, next) => {
    res.status(500).send('E:'+err);
});

// ### INITIALIZE ### //
app.listen(port);