import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// Shifted Job type to the top so we can use it throughout
type Job = { jobId: string; processingStatus: string; [key: string]: any };

type GlobalContextType = {
  currentJob: any; // Swapped 'any' for the specific Job type
  activeJobs: Job[];
  dashboardCards: any;
  recentListings: any[];
  setActiveJobs: (data: Job[]) => void;
  setCurrentJob: (data: any | null) => void;
  setRecentListings: (data: any[]) => void;
  updateJobStatus: (data: { jobId: string; status: string; data: Job }) => void;
  setDashboardCards: (data: any) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [recentListings, setRecentListings] = useState<Job[]>([]);

  // Let TypeScript infer the type here
  const [dashboardCards, setDashboardCards] = useState({
    activeJobs: 0,
    completed: 0,
    failedOrRejected: 0,
    hasFetched:false,
  });

  const updateJobStatus = ({
    jobId,
    status,
    data,
  }: {
    jobId: string;
    status: string;
    data: Job;
  }) => {
    const terminalStatuses = ["COMPLETED", "REJECTED", "FAILED"];

    if (status === "COMPLETED") {
      // Fix 1: Properly update state without mutating
      setRecentListings((prev) => [data, ...prev]);

      setDashboardCards((prev) => ({
        ...prev,
        completed: prev.completed + 1,
        activeJobs: prev.activeJobs - 1,
      }));
    } else if (terminalStatuses.includes(status)) {
      setRecentListings((prev) => [data, ...prev]);

      setDashboardCards((prev) => ({
        ...prev,
        // Fix 2: Correctly target the 'rejectOrRejected' key
        rejectOrRejected: prev.failedOrRejected + 1,
        activeJobs: prev.activeJobs - 1,
      }));
    }

    // Fix 3: Target ONLY the job with the matching jobId
    setActiveJobs(
      (prev) =>
        prev
          .map((job) => {
            if (job.jobId === jobId) {
              // Remove if terminal, otherwise update status
              return terminalStatuses.includes(status)
                ? null
                : { ...job, processingStatus: status };
            }
            return job; // Leave other jobs alone!
          })
          .filter((job): job is Job => job !== null), // Type predicate to remove nulls safely
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        dashboardCards,
        currentJob,
        activeJobs,
        recentListings,
        setRecentListings,
        setCurrentJob,
        setActiveJobs,
        updateJobStatus,
        setDashboardCards,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within GlobalProvider");
  return context;
};
