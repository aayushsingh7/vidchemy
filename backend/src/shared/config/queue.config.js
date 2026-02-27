import {Queue} from "bullmq";
import redis from "./redis.config.js"

const videoQueue = new Queue('video-processing-queue', {
    connection: redis,
    defaultJobOptions:{
        attempts:1,
        removeOnComplete:true,
        removeOnFail:false, 
    }
})

export default videoQueue;