const express = require("express");
const redis = require("redis");

const app = express();

const process = require('process');

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});





app.get('/:num', (req,resp) => {
    const num = req.params.num
    if (num < 10) {
        client.get(num.toString(), (err, data) => {
            if(err || data === null){
                const result = factorial(num);
                client.set(num.toString(), result);
                resp.send(`Calculating. Factorial(${num}) = ${result}`);
            } else {
                resp.send(`Recover from cache. Factorial(${num}) = ${data}`)
            }
        })
    } else {
        process.exit(1);
    }
});

const factorial = n => !(n > 1) ? 1 : factorial(n - 1) * n;

app.listen(8080, () => {
    console.log('Server listening on port 8080');
})