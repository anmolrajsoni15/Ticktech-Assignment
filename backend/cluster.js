const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const http = require("http");
const { connectConsistentDatabase } = require("./config/database");
require("dotenv").config({ path: "./config/config.env" });
connectConsistentDatabase();

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running on port http://localhost:${process.env.PORT}`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  const workers = {};

  // Handle messages received from worker processes
  cluster.on("message", (worker, message) => {
    if (message.status === "ready") {
      workers[worker.id] = {
        port: message.port,
      };
    }
  });

  // Round-robin load balancing
  let currentWorkerIndex = 0;
  const getNextWorker = () => {
    const workerIds = Object.keys(workers);
    if (workerIds.length === 0) return null;
    const workerId = workerIds[currentWorkerIndex];
    currentWorkerIndex = (currentWorkerIndex + 1) % workerIds.length;
    return workers[workerId];
  };

  // Create a load balancer that listens on PORT and distributes requests across workers
  http.createServer((req, res) => {
    const worker = getNextWorker();
    if (worker) {
      const options = {
        hostname: "localhost",
        port: worker.port,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };
      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });
      req.pipe(proxyReq);
    } else {
      res.statusCode = 503;
      res.end("Service Unavailable");
    }
  }).listen(process.env.PORT);

  cluster.on("exit", (worker, code, signal) => {
    delete workers[worker.id];
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
  module.exports.clusterPort = clusterPort;

  const user = require("./routes/userRoute");
  app.use("/api", user);

  app.get("/", (req, res) => {
    let cnt = 0;
    for (let i = 0; i < 100000000; i++) {
      cnt++;
    }
    res.send(`Hello World!. This is from ${process.pid} running on ${clusterPort}`);
  });

  app.use((req, res, next) => {
    res.status(404).send("Sorry, we could not find the page you were looking for!");
  });

  app.use(handleError);

  // Worker process listens on its own port
  app.listen(clusterPort, () => {
    console.log(`Server ${process.pid} listening on port http://localhost:${clusterPort}`);
    // Send a message to the master process indicating that the worker is ready
    process.send({ status: "ready", port: clusterPort });
  });
}
