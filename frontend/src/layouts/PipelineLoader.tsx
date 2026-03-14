import {
  ArrowPathIcon,
  ArrowUpRightIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../contexts/socketContext";
import { useToast } from "../hooks/useToast";
import { useGlobalContext } from "../contexts/globalContext";

const STATUS_ENUM = {
  PENDING: "PENDING",
  INGESTING: "INGESTING_AND_VERIFYING",
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  FINALIZING: "FINALIZING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REJECTED: "REJECTED",
};

const PIPELINE_STEPS = [
  {
    key: STATUS_ENUM.PENDING,
    label: "Pending",
    description:
      "Your request has been received and is getting ready to start processing.",
  },
  {
    key: STATUS_ENUM.INGESTING,
    label: "Analyzing Content",
    description:
      "We're fetching the video and analyzing its content to understand what's inside.",
  },
  {
    key: STATUS_ENUM.QUEUED,
    label: "In Queue",
    description:
      "Your request is waiting in line and will start processing shortly.",
  },
  {
    key: STATUS_ENUM.PROCESSING,
    label: "Processing",
    description:
      "Our AI is working on generating insights, extracting products, and processing the video.",
  },
  {
    key: STATUS_ENUM.FINALIZING,
    label: "Finalizing Results",
    description:
      "We're preparing the final results and organizing everything for you.",
  },
  {
    key: STATUS_ENUM.COMPLETED,
    label: "Completed",
    description:
      "Your results are ready! You can now view the extracted insights and product details.",
  },
];

const TERMINAL_ERROR_STATES = [STATUS_ENUM.FAILED, STATUS_ENUM.REJECTED];
const REJECTED_INDEX = PIPELINE_STEPS.findIndex(
  (s) => s.key === STATUS_ENUM.INGESTING,
);

// ── Drum Physics ────
const DRUM_RADIUS = 250;
const ANGLE_STEP = 30;

function drumTransform(offset: number) {
  const rad = (offset * ANGLE_STEP * Math.PI) / 180;
  return {
    y: DRUM_RADIUS * Math.sin(rad),
    scale: Math.pow(Math.cos(rad), 1),
  };
}

function StatusIndicator({
  isCompleted,
  isCurrent,
  isFailed,
}: {
  isCompleted: boolean;
  isCurrent: boolean;
  isFailed: boolean;
}) {
  if (isFailed) {
    return (
      <div className="w-9 h-9 rounded-full bg-red-500/15 border-2 border-red-500/55 flex items-center justify-center flex-shrink-0">
        <XMarkIcon className="w-4 h-4 text-red-400" strokeWidth={2.5} />
      </div>
    );
  }
  if (isCompleted) {
    return (
      <div className="w-9 h-9 rounded-full bg-emerald-500/15 border-2 border-emerald-500/55 flex items-center justify-center flex-shrink-0">
        <CheckIcon className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
      </div>
    );
  }
  if (isCurrent) {
    return (
      <div className="w-9 h-9 rounded-full bg-indigo-600/12 border-2 border-indigo-600/65 flex items-center justify-center flex-shrink-0">
        <ArrowPathIcon
          className="w-[17px] h-[17px] text-indigo-600"
          strokeWidth={2}
          style={{ animation: "spin 1.4s linear infinite" }}
        />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full border-2 bg-gray-800 border-gray-600/50 flex-shrink-0" />
  );
}

const PipelineLoader = ({}) => {
  const socket = useSocket();
  const { jobId } = useParams();
  const { activeJobs } = useGlobalContext();
  const [status, setStatus] = useState<string>(STATUS_ENUM.PENDING);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const isTerminalError = TERMINAL_ERROR_STATES.includes(status);
  const lastLinearIndexRef = useRef(0);
  const toast = useToast();
  const navigate = useNavigate();

  const resolvedIndex = useMemo(() => {
    if (status === STATUS_ENUM.REJECTED) return REJECTED_INDEX;
    if (status === STATUS_ENUM.FAILED) return lastLinearIndexRef.current;
    const idx = PIPELINE_STEPS.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  }, [status]);

  if (!isTerminalError) {
    const idx = PIPELINE_STEPS.findIndex((s) => s.key === status);
    if (idx !== -1) lastLinearIndexRef.current = idx;
  }

  const [currentIndex, setCurrentIndex] = useState(resolvedIndex);

  useEffect(() => {
    const id = requestAnimationFrame(() => setCurrentIndex(resolvedIndex));
    return () => cancelAnimationFrame(id);
  }, [resolvedIndex]);

  useEffect(() => {
    const isActiveJob = activeJobs.find((job: any) => job.jobId == jobId);
    if (!isActiveJob) {
      fetchListingStatus();
    } else {
      setStatus(isActiveJob.processingStatus);
    }
  }, []);

  const fetchListingStatus = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/listings/${jobId}/status`,
      );
      const data = await res.json();
      if (!data.data) navigate(-1);
      setStatus((prev) => {
        if (prev === "PENDING") return data.data;
        return prev;
      });
    } catch (err) {
      console.log(err);
      toast.error("Oops! something went wrong");
    }
  };
  // const progress = (currentIndex / (PIPELINE_STEPS.length - 1)) * 100;

  useEffect(() => {
    const handler = (data: {
      jobId: string;
      status: string;
      errorMessage: null | string;
      data: null | any;
    }) => {
      if (data.jobId == jobId) {
        setStatus(data.status);
        if (data.errorMessage) setErrorMsg(data.errorMessage);
      }
    };

    socket.on("job-status", handler);
    return () => {
      socket.off("job-status", handler);
    }; // ← cleanup
  }, [socket, jobId]);

  return (
    <>
      <div className="select-none relative font-inter pipeline-root bg-gray-900 h-[100dvh] flex flex-col items-center justify-center">
        <div className="w-full max-w-[700px]">
          <div className="mb-6">
            {/* <div className="flex items-start justify-between">
              <div>rackin
                <p className="text-md text-gray-500 uppercase mb-1">
                  Execution Pipeline
                </p>
                <h1 className="text-gray-100 text-[17px] font-semibold leading-tight">
                  {isTerminalError ? status : currentStep.label}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-semibold tracking-[0.2em] uppercase"
                  style={{
                    background: livePillColor.bg,
                    borderColor: livePillColor.border,
                    color: livePillColor.text,
                  }}
                >
                  <span className={`dot-pulse w-[5px] h-[5px] rounded-full ${dotClass}`} />
                  {livePillLabel}
                </span>
                <span className="text-[9px] text-gray-600 tracking-wider">
                  {currentIndex + 1}&nbsp;/&nbsp;{PIPELINE_STEPS.length}
                </span>
              </div>
            </div> */}

            <div className="flex items-center justify-between">
              <Link
                className="flex items-center justify-center text-lg text-indigo-400 font-bold tracking-wider"
                to={"/dashboard"}
              >
                <ArrowUpRightIcon className="h-6 w-6 mr-1" />
                Dashboard
              </Link>
              <span className="text-xl text-gray-400 font-bold">
                {currentIndex + 1}&nbsp;/&nbsp;{PIPELINE_STEPS.length}
              </span>
            </div>
            {/* Progress bar */}
            {/* <div className="mt-4">
              <div className="h-[5px] bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${isTerminalError ? 100 : progress}%`,
                    background: isTerminalError ? "#ef4444" : "#4F46E5",
                  }}
                />
              </div>
            </div> */}
          </div>

          {/* ── Drum Viewport ── */}
          <div
            className="relative w-full rounded-3xl overflow-hidden"
            style={{
              height: 490,
              background:
                "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(6,182,212,0.022) 0%, transparent 70%)",
              maskImage:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 11%, black 19%, black 81%, rgba(0,0,0,0.55) 89%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 11%, black 19%, black 81%, rgba(0,0,0,0.55) 89%, transparent 100%)",
            }}
          >
            {PIPELINE_STEPS.map((step, index) => {
              const offset = index - currentIndex;
              const absOffset = Math.abs(offset);

              if (absOffset > 3) return null;

              const { y, scale } = drumTransform(offset);
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isFailed = isCurrent && isTerminalError;

              const opacity = isCurrent
                ? 1
                : Math.max(0.1, 1 - absOffset * 0.25);
              const shouldBlur = absOffset >= 3;

              return (
                <div
                  key={step.key}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    padding: "0 15px",
                    transform: `translateY(calc(-50% + ${y}px)) scale(${scale})`,
                    transformOrigin: "center center",
                    opacity,
                    filter: shouldBlur ? "blur(2.5px)" : undefined,
                    zIndex: 10 - absOffset,
                    transition:
                      "transform 0.7s cubic-bezier(0.34, 1.08, 0.64, 1), opacity 0.55s ease",
                    willChange: "transform, opacity",
                  }}
                >
                  <div className="flex items-start gap-4 px-5 py-6 rounded-[10px] bg-gray-800 border-2 border-gray-500/30 ">
                    <div className="mt-0.5">
                      <StatusIndicator
                        isCompleted={status == "COMPLETED" || isCompleted}
                        isCurrent={isCurrent}
                        isFailed={isFailed}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xl font-bold uppercase"
                        style={{
                          color: isFailed
                            ? "#f87171"
                            : isCompleted || status == "COMPLETED"
                              ? "#34d399"
                              : isCurrent
                                ? "#4F46E5"
                                : "#9CA3AF",
                        }}
                      >
                        {step.label}
                      </div>
                      <p
                        className="mt-2 text-md text-gray-400"
                        style={{
                          color:
                            isCurrent && isTerminalError
                              ? "#e46565"
                              : isCurrent
                                ? "#9CA3AF"
                                : "#6B7280",
                        }}
                      >
                        {isCurrent && isTerminalError
                          ? errorMsg
                          : step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Step Dots ── */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {PIPELINE_STEPS.map((_, i) => (
              <div
                key={i}
                className="transition-all duration-300"
                style={{
                  width: i === currentIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background:
                    isTerminalError && i === currentIndex
                      ? "rgba(239,68,68,0.8)"
                      : i < currentIndex
                        ? "rgba(52,211,153,0.55)"
                        : i === currentIndex
                          ? "rgba(34,211,238,0.8)"
                          : "rgba(55,65,81,0.5)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PipelineLoader;
