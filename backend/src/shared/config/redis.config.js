import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URI, {maxRetriesPerRequest:null});

redis.on("ready", ()=> { 
      console.log("Redis Connected & Ready ✅");
})

redis.on("error", (err) => {
  console.error("Redis error ❌:", err);
});

export default redis;