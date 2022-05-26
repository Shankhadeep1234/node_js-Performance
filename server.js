const express = require("express");
const cluster = require("cluster");
const os = require("os");

const app = express();

const PORT = process.env.PORT || 3000;

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    //event loop is blocked...
  }
}

app.get("/", (req, res) => {
  res.send(`Performance example: ${process.pid}`);
});

app.get("/timer", (req, res) => {
  delay(9000);
  res.send(`Ding ding ding! :${process.pid}`);
});

if (cluster.isMaster) {
  console.log(`Master process is started...`);
  const NUM_WORKERS = os.cpus().length;
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }
} else {
  console.log("Worker process started");
  app.listen(PORT, () => {
    console.log(`App is listening on PORT:${PORT}`);
  });
}
