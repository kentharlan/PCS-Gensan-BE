const express = require('express');
const cors = require('cors');

require('dotenv').config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", require("./Routes/users"));
app.use("/api/login", require("./Routes/login"));
app.use("/api/rates", require("./Routes/rates"));
app.use("/api/rooms", require("./Routes/rooms"));
app.use("/api/txn", require("./Routes/txn"));

app.use(express.static("build"));
app.get("*", (req, res, next) => {
    if (req.accepts('html')) {
        res.sendFile("index.html", { root: "build" });
    } else {
        next(); // Pass to next middleware if the request does not accept HTML
    }
});

const { init } = require('./init');
const { Ws } = require('./RPI/ws');

const initApp = () => {
    Ws.init1()
    Ws.init2()
    Ws.init3()
    init();
    console.log(`BE server is running at port ${port}`);
}

const port = process.env.PORT
app.listen(port, initApp)