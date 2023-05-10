const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const http = require("http");
const { connectDatabase } = require("./config/database");
require("dotenv").config({ path: "./config/config.env" });
connectDatabase();

if (cluster.isMaster) {
  console.log(
    `Master ${process.pid} is running on port http://localhost:${process.env.PORT}`
  );

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Create a load balancer that listens on PORT and distributes requests across workers using Round-robin algorithm
  const workers = Object.values(cluster.workers);
  let currentWorkerIndex = 0;
  http
    .createServer((req, res) => {
      const worker = workers[currentWorkerIndex];
      const options = {
        hostname: "localhost",
        port: parseInt(process.env.PORT) + worker.id,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };
      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });
      req.pipe(proxyReq);
      currentWorkerIndex = (currentWorkerIndex + 1) % numCPUs;
    })
    .listen(process.env.PORT);

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const express = require("express");
  const handleError = require("./middlewares/error");

  const app = express();
  const { connectDatabase } = require("./config/database");

  require("dotenv").config({ path: "./config/config.env" });
  app.use(express.json());

  const clusterPort = parseInt(process.env.PORT) + cluster.worker.id;
  exports.clusterPort = clusterPort;

  const user = require("./routes/userRoute");
  app.use("/api", user);

  app.get("/", (req, res) => {
    let cnt = 0;
    for (let i = 0; i < 100000000; i++) {
      cnt++;
    }
    res.send(`Hello World!. This is from ${process.pid} running on ${parseInt(process.env.PORT) + cluster.worker.id}`);
  });

  app.use((req, res, next) => {
    res
      .status(404)
      .send("Sorry, we could not find the page you were looking for!");
  });

  app.use(handleError);
  try {
    app.listen(parseInt(process.env.PORT) + cluster.worker.id, () => {
      console.log(
        `Server ${process.pid} listening on port http://localhost:${
          parseInt(process.env.PORT) + cluster.worker.id
        }`
      );
    });
  } catch (error) {
    console.log("Can't connect to the server");
  }
}
