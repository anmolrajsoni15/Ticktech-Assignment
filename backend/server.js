const express = require('express');
const handleError = require('./middlewares/error');

const app = express();
const {connectDatabase} = require('./config/database');

require('dotenv').config({path: "./config/config.env"});
app.use(express.json());

const user = require('./routes/userRoute');
app.use("/api", user);


app.get('/', (req, res) => {
    let cnt = 0;
    for (let i = 0; i < 100000000; i++) {
        cnt++;
    }
    res.send(`Hello World!. This is from ${process.pid}`);
});

app.use((req, res, next) => {
    res.status(404).send('Sorry, we could not find the page you were looking for!');
});

app.use(handleError);

connectDatabase().then(() => {
    try {
        app.listen(process.env.PORT, () => {
            console.log(`Server ${process.pid} listening on port http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Can't connect to the server");
    }
}).catch((err) => {
    console.log("Invalid Database Connection...!");
});

