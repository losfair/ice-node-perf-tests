const mongodb = require("mongodb").MongoClient;
const assert = require("assert");
const ice = require("ice-node");
const app = new ice.Ice();

let db;

app.use("/", new ice.Flag("init_session"));
app.post("/login", async req => {
    if(req.session.user_id) {
        return ice.Response.json({
            err: 1,
            msg: "Already logged in"
        });
    }
    let data = req.form();
    assert(data.username);
    await db.collection("users").find({
        name: data.username
    });
    req.session.user_id = "some_user";
    return ice.Response.json({
        err: 0,
        msg: "OK"
    });
});

app.get("/read/:id", async req => {
    if(!req.session.user_id) {
        return ice.Response.json({
            err: 1,
            msg: "Not logged in"
        });
    }
    let id = req.params.id;
    await db.collection("articles").find({
        id: id
    });
    return ice.Response.json({
        err: 0,
        msg: "OK",
        title: "",
        content: ""
    });
});

async function run() {
    db = await mongodb.connect("mongodb://127.0.0.1:27017/test");
    app.listen("127.0.0.1:6001");
}

run();
