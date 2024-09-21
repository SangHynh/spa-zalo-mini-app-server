const redis = require("redis");

const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});

process.on("SIGINT", () => {
  client.quit();
});

client.on('connect', ()=>{
  console.log("Client connected to Redis")
})
client.on('ready', ()=>{
  console.log("Client connected to Redis and ready to use")
})
client.on('error', (err)=>{
  console.log(err)
})
client.on('end', ()=>{
  console.log("Client disconnected from Redis")
})

client
  .connect()
  .then(() => {
    console.log("Connected to Redis successfully");
  })
  .catch((err) => {
    console.log('Failed to connect to Redis: ', err.message);
  });

module.exports = client;
