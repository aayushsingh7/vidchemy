import { useEffect, useState } from "react";
import timeAgo from "../utils/timeAgo";
import { useSocket } from "../contexts/socketContext";

interface JobProps {
  job: {
    sourceUrl: string;
    createdAt: string;
    processingStatus: string;
    jobId: string;
  };
}

const JobBox: React.FC<JobProps> = ({ job }) => {
  const socket = useSocket();
  const [duration, setDuration] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<string>(job.processingStatus);

  useEffect(() => {
    const interval = setInterval(() => setDuration(timeAgo(job.createdAt)));
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("job-status", (data: { jobId: string; status: string }) => {
      if (data.jobId == job.jobId) {
        setJobStatus(data.status);
      }
    });
  }, [socket]);

  return (
    <div className="relative p-3 px-5 bg-gray-900 border-2 border-gray-500/30 rounded-[10px]">
      <span className="px-3 absolute font-bold right-4 text-sm text-white bg-gray-800 border-2 border-gray-500/30 rounded-[20px] p-2">
        {jobStatus}
      </span>

      <div className="flex flex-col mb-3">
        <span className="font-bold text-gray-400 text-sm">Source Url</span>
        <span className="text-blue-400">{job.sourceUrl}</span>
      </div>

      <div className="flex flex-col mb-3">
        <span className="font-bold text-gray-400 text-sm">Platform</span>
        <span className="text-blue-400 flex items-center gap-2">
          <img src="instagram.png" alt="youtube" className="w-6" />
          Instagram.com
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-gray-400 text-sm">Started When</span>
        <span className="text-gray-200 flex items-center gap-2">
          {duration}
        </span>
      </div>
    </div>
  );
};

export default JobBox;
