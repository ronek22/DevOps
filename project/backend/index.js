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

pgClient.on('error', () => {console.log('No connection to PG DB')});

pgClient.query('CREATE TABLE IF NOT EXISTS results(number CHAR(5))')
.then(() => {
    console.log("Table created successfully!");
}).catch(
    err => console(`Error during creating table ${err}`)
);

const duration_to_number = function(duration) {
    hours = duration[0] * 60;
    minutes = duration[1];
    seconds = duration[2] / 60;

    return hours+minutes+seconds;
}

const calc_pace = function(distance, duration) {
    pace = duration_to_number(duration) / distance;
    minutes = pace | 0;
    seconds = ((pace - minutes) * 60) | 0;

    if (seconds < 10){
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

console.log(keys);

app.get("/:distance/:duration", (req, resp) => {
    const key = `${req.params.distance}&${req.params.duration}`;
    const distance = +req.params.distance;
    const duration = req.params.duration.split(':').map(x=>+x);

    console.log(`Distance: ${distance}\tDuration: ${duration}`)
    
    if (duration.length !== 3){
        return resp.send({error: "Czas musi być w formie H:M:S"});
    }

    if (distance === 0) {
        return resp.send({error: "Dystans musi być większy do 0"});
    }    

    if (isNaN(distance)) {
        return resp.send({error: "Dystans musi być liczbą!"});
    }

    redisClient.get(key, (err, pace) => {
        if(!pace) {
            pace = calc_pace(distance, duration);
            redisClient.set(key, pace);
        }
        pgClient.query('INSERT INTO results(number) VALUES ($1)', [pace]).catch(err => {console.log(err)});
        resp.send({result: pace})
    });

});

app.get("/results/", (req, resp) => {
    console.log("Access results page");
    pgClient.query("SELECT * FROM results", (err,res) => {
        if (err) {
            console.log(err.stack, res);
            resp.send('Error occured when reading from db');
        } else {
            resp.send(res.rows);
        }
    });
    // resp.send('Error cannot connect to PostgresDB')
});


app.listen(4000, err => {
    console.log("Server listening on port 4000");
});

