import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import timeAgo from "../utils/timeAgo";

interface JobProps {
  job: {
    sourceUrl: string;
    createdAt: string;
    processingStatus: string;
    jobId: string;
  };
}

const JobBox: React.FC<JobProps> = ({ job }) => {
  const [duration, setDuration] = useState<string>("");
  
  useEffect(() => {
    const interval = setInterval(() => setDuration(timeAgo(job.createdAt)));
    return () => clearInterval(interval);
  }, []);


  return (
    <Link  to={`/status/${job.jobId}`} className="relative p-3 px-5 bg-zinc-900 border-2 border-gray-500/30 rounded-[10px]">
      <span className="inline-block px-3 font-bold mb-[10px] text-[12px] text-white bg-zinc-800 border-2 border-gray-500/30 rounded-[5px] p-1">
        {job.processingStatus.split("_").join(" ")}
      </span>

      <div className="flex flex-col mb-3">
        <span className="font-bold text-gray-400 text-sm">Source Url</span>
         <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-400 hover:underline line-clamp-1">{job.sourceUrl}</a>
      </div>

      <div className="flex flex-col mb-3">
        <span className="font-bold text-gray-400 text-sm">Platform</span>
        <span className="text-white flex items-center gap-2">
          <img src="instagram.png" alt="youtube" className="w-5" />
          Instagram.com
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-gray-400 text-sm">Started When</span>
        <span className="text-gray-200 flex items-center gap-2">
          {duration}
        </span>
      </div>
    </Link>
  );
};

export default JobBox;
