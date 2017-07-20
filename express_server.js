const mongodb = require("mongodb").MongoClient;
const assert = require("assert");
const express = require("express");
const body_parser = require("body-parser");
const express_session = require('express-session')
const app = express();

app.use(express_session({
    secret: "some secret"
}));
app.use(body_parser.urlencoded({
    extended: false
}));

let db;

app.post("/login", async (req, resp) => {
    if(req.session.user_id) {
        return resp.json({
            err: 1,
            msg: "Already logged in"
        });
    }
    let data = req.body;
    assert(data.username);
    await db.collection("users").find({
        name: data.username
    });
    req.session.user_id = "some_user";
    return resp.json({
        err: 0,
        msg: "OK"
    });
});

app.get("/read/:id", async (req, resp) => {
    if(!req.session.user_id) {
        return resp.json({
            err: 1,
            msg: "Not logged in"
        });
    }
    let id = req.params.id;
    await db.collection("articles").find({
        id: id
    });
    return resp.json({
        err: 0,
        msg: "OK",
        title: "",
        content: ""
    });
});

async function run() {
    db = await mongodb.connect("mongodb://127.0.0.1:27017/test");
    app.listen(6002);
}

run();
