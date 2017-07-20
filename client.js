const rp = require("request-promise");
const request = require("request");
const assert = require("assert");

async function run() {
    let target = process.argv[2];
    let threads = parseInt(process.argv[3]);

    console.log("Target: " + target);
    console.log("Threads: " + threads);

    let done = 0;
    let t1 = Date.now();

    for(let i = 0; i < threads; i++) {
        start_thread(target).then(_ => {
            done++;
            if(done == threads) {
                let t2 = Date.now();
                console.log("Done. Threads: " + threads + " Total time: " + (t2 - t1) + " ms");
            }
        }).catch(e => {
            console.log(e);
            process.exit(1);
        });
    }
}

async function start_thread(target) {
    let cookie_jar = request.jar();
    let r = await rp.post(target + "/login", {
        jar: cookie_jar,
        form: {
            username: "test_user"
        }
    });
    r = JSON.parse(r);
    assert(r.err === 0);

    for(let i = 0; i < 100; i++) {
        r = await rp.get(target + "/read/" + i, {
            jar: cookie_jar
        });
        r = JSON.parse(r);
        assert(r.err === 0);
    }

    //console.log("OK");
}

run().then(_ => {}).catch(e => {
    console.log(e);
    process.exit(1);
});
