import { HomeIcon } from "@heroicons/react/24/outline";

const overviewCards = [
  {
    heading: "Active Jobs",
    txt: "2",
    extraTxt: "/2",
    color: "text-indigo-400",
  },
  {
    heading: "Completed Jobs",
    txt: "1",
    extraTxt: "",
    color: "text-green-400",
  },
  {
    heading: "Failed/Rejected Jobs",
    txt: "0",
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

const Home = () => {
  return (
    <main className="font-inter flex-1 overflow-y-auto px-6 text-gray-300 w-full bg-gray-900 h-[100dvh]">
      <h2 className="text-2xl h-16 font-semibold text-white flex items-center gap-3">
        Overview
      </h2>
      <section className="grid grid-cols-4 gap-2 mb-10">
        {overviewCards.map((data) => {
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
      <section className="grid grid-cols-2 mb-10 gap-2">
        {Array.from({ length: 2 }).map(() => {
          return (
            <div className="relative p-3 px-5 bg-gray-900 border-2 border-gray-500/30 rounded-[10px]">
              <span className="px-3 absolute font-bold right-4 text-sm text-white bg-gray-800 border-2 border-gray-500/30 rounded-[20px] p-2">
                PROCESSING
              </span>

              <div className="flex flex-col mb-3">
                <span className="font-bold text-gray-400 text-sm">Source Url</span>
                <span className="text-blue-400">
                  https://www.youtube.com/watch?v=K1OfIxlPNTs
                </span>
              </div>

              <div className="flex flex-col mb-3">
                <span className="font-bold text-gray-400 text-sm">Platform</span>
                <span className="text-blue-400 flex items-center gap-2">
                  <img src="youtube.png" alt="youtube" className="w-6" />
                  Youtube.com
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-gray-400 text-sm">Started When</span>
                <span className="text-gray-200 flex items-center gap-2">
                  2 mins ago
                </span>
              </div>

            </div>
          );
        })}
      </section>

      <h2 className="text-2xl h-16 font-semibold text-white flex items-center gap-3">
        Recent Creations
      </h2>
      <section className="grid grid-cols-2 mb-10 gap-2">
        {Array.from({ length: 3 }).map(() => {
          return (
            <figure className="p-3 border-2 border-gray-500/30 flex items-center gap-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnBOMAQKX-l9AvLQw8AMj53npLfUJp2Ll4WQ&s"
                className="w-30 h-30 rounded-[10px]"
              />
              <figcaption>
                <h3 className="text-xl font-bold mb-3">Boat Rockerz 550</h3>
                <p className="line-clamp-3 text-sm text-gray-400">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex
                  nobis voluptatibus, quam velit, tempora maiores quaerat ipsum,
                  eveniet at quisquam ut eligendi nulla. Cum nihil doloribus,
                  magni voluptates nemo laudantium.
                </p>
              </figcaption>
            </figure>
          );
        })}
      </section>
    </main>
  );
};

export default Home;
