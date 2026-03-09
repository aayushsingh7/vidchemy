import { useEffect } from "react";
import JobBox from "../../components/JobBox";
import Loader from "../../components/Loader";
import NoDataTemplate from "../../components/NoDataTemplate";
import { useGlobalContext } from "../../contexts/globalContext";
import { useGuestAccount } from "../../hooks/useGuestAccount";
import { useToast } from "../../hooks/useToast";

const DashboardHome = () => {
  const guestId = useGuestAccount();
  const toast = useToast();
  const {activeJobs, recentListings, dashboardCards, setActiveJobs, setRecentListings, setDashboardCards } =
    useGlobalContext();

  useEffect(() => {
    if (!guestId || dashboardCards.hasFetched) {
      return;
    }
    fetchDashboardOverview();
  }, [guestId]);

  async function fetchDashboardOverview() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard/overview?userId=${guestId}`,
      );
      const { data } = await res.json();
      setActiveJobs(data.activeJobs);
      setRecentListings(data.recentListings);
      setDashboardCards({
        activeJobs: data.activeJobs.length,
        completed: data.completed,
        failedOrRejected: data.failed + data.rejected,
        hasFetched:true,
      });


    } catch (err) {
           toast.error("Oops! something went wrong, please try again");
    }
  }

  if (!dashboardCards.hasFetched) return <Loader />;

  const overviewCards = [
    {
      heading: "Active Jobs",
      txt: dashboardCards.activeJobs,
      extraTxt: "/2",
      color: "text-indigo-400",
    },
    {
      heading: "Completed Jobs",
      txt: dashboardCards.completed,
      extraTxt: "",
      color: "text-green-400",
    },
    {
      heading: "Failed/Rejected Jobs",
      txt: dashboardCards.failedOrRejected,
      extraTxt: "",
      color: "text-red-400",
    },
    {
      heading: "Credits Usage",
      txt: "N/A",
      extraTxt: "",
      color: "text-gray-400",
    },
  ];

  return (
    <main className="font-inter flex-1 overflow-y-auto px-6 text-gray-300 w-full bg-gray-900 h-[100dvh]">
      <h2 className="text-2xl h-16 font-semibold text-white flex items-center gap-3">
        Overview
      </h2>
      <section className="grid grid-cols-4 gap-2 mb-10">
        {overviewCards.map((data:any) => {
          return (
            <div className="p-3 px-5 bg-gray-900 border-2 border-gray-500/30 rounded-[10px]">
              <h3 className="text-md font-bold text-gray-400 mb-5">
                {data.heading}
              </h3>
              <div>
                <span className={`text-5xl text-bold ${data.color}`}>
                  {data.txt}
                </span>
                {data.extraTxt && (
                  <span className="text-4xl text-gray-400 text-bold">
                    {data.extraTxt}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <h2 className="text-2xl h-16 font-semibold text-white flex items-center gap-3">
        Live Progress
      </h2>

      {activeJobs.length === 0 ? (
        <NoDataTemplate text="No Active Process" />
      ) : (
        <section className="grid grid-cols-2 mb-10 gap-2">
          {activeJobs.map((job: any) => (
            <JobBox key={job.id} job={job} />
          ))}
        </section>
      )}

      <h2 className="text-2xl h-16 font-semibold text-white flex items-center gap-3">
        Recent Creations
      </h2>
      {recentListings.length == 0 ? (
        <NoDataTemplate text="No Recent Creations" />
      ) : (
        <section className="grid grid-cols-2 mb-10 gap-2">
          {recentListings.map((data: any) => {
            return (
              <figure className="p-3 border-2 border-gray-500/30 flex items-center gap-4">
                <img
                  src={data.medias[0]}
                  className="w-30 h-30 rounded-[10px] bg-white"
                />
                <figcaption>
                  <h3 className="line-clamp-1 text-xl font-bold mb-3">
                    {data.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-gray-400">
                    {data.description}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default DashboardHome;
