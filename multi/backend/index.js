const keys = require("./keys");

const express = require("express");
const bodyParser = require("body-parser")

const app = express();
app.use(bodyParser.json());

const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// tworzenie polaczen jest operacja kosztowna
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS results(number INT)').catch(err => console.log(err));

console.log(keys);

const gcd = function(a, b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

const insert_number = function(number) {

}

app.get("/", (req, resp) => {
    resp.send("Hello world from backend!!")
})

app.get("/gcd/:a/:b", (req, resp) => {
    const a = req.params.a;
    const b = req.params.b;
    const pair = `${a},${b}`;


    redisClient.get(pair, (err, data) => {
            if(err || data === null){
                const result = gcd(a, b);
                redisClient.set(pair, result);
                resp.send(`Calculating. GCD(${pair}) = ${result}`);

                pgClient.query('INSERT INTO results(number) VALUES ($1)', [result], (err, res) => {
                    if(err) {
                        console.log(err.stack);
                    }
                });
            } else {
                insert_number(data);
                resp.send(`Recover from cache. GCD(${pair}) = ${data}`)
            }
        });
});

app.get("/gcd/", (req, resp) => {
    pgClient.query("SELECT * FROM results", (err,res) => {
        if (err) {
            console.log(err.stack, res);
            resp.send('Error occured when reading from db');
        } else {
            resp.send(res.rows);
        }
    });
});

app.listen(4000, err => {
    console.log("Server listening on port 4000");
});

