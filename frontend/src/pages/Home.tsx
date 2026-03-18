import { Dialog, DialogPanel } from "@headlessui/react";
import { ArrowLongRightIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DropDown from "../components/DropDown";
import { useGuestAccount } from "../hooks/useGuestAccount";
import { useToast } from "../hooks/useToast";
import DialogBox from "../components/DialogBox";
import {
  ArrowUpTrayIcon,
  BoltIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";

const navigation: any[] = [];
const productCategories = [
  "Headphones",
  "Jacket",
  "Watch",
  "Shoe",
  "Bag",
  "Sunglasses",
  "Mobile Phone",
  "Laptop",
  "Cosmetics",
];

const Home = () => {
  const guestId = useGuestAccount();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [productType, setProductType] = useState<string>("Jacket");
  const [url, setUrl] = useState<string>(
    "https://www.instagram.com/reel/DRBSbEgkSVy/",
  );
  const toast = useToast();

  const createNewJob = async (verified: boolean = false) => {
    if (!productType) {
      toast.error("Please select a product type");
      return;
    }

    if (!/^https:\/\/(www\.)?instagram\.com\/reel\//.test(url)) {
      toast.error("Only instagram reels are supported");
      return;
    }

    if (url !== "https://www.instagram.com/reel/DRBSbEgkSVy/" && !verified) {
      setShowDialog(true);
      return;
    }
    setShowDialog(false);
    setLoading(true);
    try {
      let currencyCode = "INR";

      try {
        const locationRes = await fetch("https://ipapi.co/json");
        const location = await locationRes.json();
        currencyCode = location?.currency === "INR" ? "INR" : "USD";
      } catch (err) {
        currencyCode = "INR";
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          productType,
          guestId,
          primarySourceUrl: null,
          currencyCode
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      navigate(`/status/${data.data.jobId}`);
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: "Video Intelligence",
      description:
        "AI extracts your best product frame, transcribes audio, and identifies key features - all from a single Reel",
      icon: <VideoCameraIcon className="text-indigo-500 w-7" />,
    },
    {
      title: "Instant Product Images",
      description:
        "Background removed, marketplace-ready, studio-quality photos generated without a camera or editor.",
      icon: <PhotoIcon className="text-indigo-500 w-7" />,
    },
    {
      title: "SEO & Listing Copy",
      description:
        "Optimized titles, bullet points, and keywords tailored for Amazon's A10 algorithm - written in seconds.",
      icon: <ChartBarIcon className="text-indigo-500 w-7" />,
    },
    {
      title: "Competitor Insights",
      description:
        "Analyzes top-ranking listings so your product always launches ahead of the competition.",
      icon: <UserGroupIcon className="text-indigo-500 w-7" />,
    },
  ];

  const steps = [
    {
      step: "01",
      icon: <ArrowUpTrayIcon className="w-6 h-6" />,
      title: "Paste Your Reel",
      desc: "Drop in any Instagram Reel URL featuring your product.",
    },
    {
      step: "02",
      icon: <MagnifyingGlassIcon className="w-6 h-6" />,
      title: "AI Scans Everything",
      desc: "Frames, audio, and on-screen text are all analyzed instantly.",
    },
    {
      step: "03",
      icon: <PhotoIcon className="w-6 h-6" />,
      title: "Image Enhanced",
      desc: "Best frame extracted, background removed, ready for marketplace.",
    },
    {
      step: "04",
      icon: <BoltIcon className="w-6 h-6" />,
      title: "Listing Generated",
      desc: "SEO titles, bullets, keywords - all optimized for A10.",
    },
    // {
    //   step: "05",
    //   icon: <RocketLaunchIcon className="w-6 h-6" />,
    //   title: "Publish & Sell",
    //   desc: "Export directly to Amazon or Flipkart Seller Central.",
    // },
  ];

  return (
    <div>
      <div className="polka-bg" id="hero">
        {showDialog && (
          <DialogBox
            title="Before We Start!"
            bulletPoints={[
              "Make sure the selected category matches the product in your video",
              "Product must be clearly visible for at least 2-4 seconds",
              "Video should feature only one product",
              "Poor or unrelated videos will be auto-rejected",
            ]}
            btn1Text="Go Back"
            btn1Style="bg-gray-700 hover:bg-gray-600"
            btn2Style="bg-indigo-600 hover:bg-indigo-500"
            btn2Text="Continue"
            onBtn1Click={() => setShowDialog(false)}
            onBtn2Click={() => createNewJob(true)}
          />
        )}
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            aria-label="Global"
            className="flex items-center justify-between p-6 lg:px-8"
          >
            <div className="flex lg:flex-1"></div>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
              >
                <span className="sr-only">Open main menu</span>
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm/6 font-semibold text-white"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </nav>
          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt=""
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-200"
                >
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-white/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </header>

        <div className="font-inter relative isolate px-6 pt-40 lg:px-8 h-[100dvh] overflow-hidden">
          <div className="mx-auto w-full flex items-center justify-center flex-col">
            <h1 className="relative leading-tight text-center text-4xl max-w-5xl  font-semibold tracking-tight text-balance text-white sm:text-7xl">
              From Video to{" "}
              <span className="text-indigo-600">Amazon Best-Seller</span> in{" "}
              <span className="relative">
                <span className="absolute right-0 w-full h-[4px] bottom-[-3px] bg-indigo-600 block"></span>
                <span className="absolute left-0 w-[80%] h-[4px] bottom-[-15px] bg-indigo-600 block"></span>
                Minutes
              </span>
              .
            </h1>
            <p className="mt-10 text-2xl max-w-2xl text-gray-400 text-center">
              Stop wasting days on copywriting - let AI extract the gold from
              your post and dominate the A10 algorithm.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createNewJob(false);
              }}
              className="mt-10 max-w-3xl flex items-center border gap-2 bg-gray-800 border-gray-500/30 h-17  w-full rounded-full"
            >
              <DropDown
                options={productCategories}
                defaultTxt="Jacket"
                onSelect={setProductType}
              />
              <input
                onChange={(e: any) => setUrl(e.target.value)}
                value={url}
                type="url"
                placeholder="Enter Instagram Post or Reel Link"
                className="w-full h-full pl-2 outline-none text-xl placeholder-gray-400 text-white"
                required
              />
              <button
                disabled={loading}
                type="submit"
                className="bg-indigo-600 active:scale-95 transition w-30 h-14  rounded-full text-xl font-bold text-white mr-1 flex items-center justify-center"
              >
                {loading ? (
                  <ArrowPathIcon
                    className="w-8 h-8 font-bold"
                    style={{ animation: "spin 1.4s linear infinite" }}
                  />
                ) : (
                  <ArrowLongRightIcon className="w-10 h-10" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="px-30 py-10 bg-gray-950">
        <section>
          <h2 className="relative leading-tight text-6xl font-semibold tracking-tight text-balance text-white flex flex-col">
            <span>One App.</span>
            <span className="text-indigo-600">Everything You Need.</span>
          </h2>

          <p className="text-gray-400 mt-5 text-lg max-w-xl">
            Stop juggling tools. Vidchemy handles your visuals, copy, SEO, and
            competitor research - all in one place, all in minutes.
          </p>

          <div className="grid grid-cols-2 mt-10 gap-[20px]">
            {features.map((feature: any) => {
              return (
                <div className="border-2 border-gray-500/30 p-5 bg-gray-900 rounded-[10px]">
                  <div className="w-11 h-11 bg-indigo-500/20 flex items-center justify-center mb-2 rounded-[5px]">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold text-2xl">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mt-4">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-32 relative">
          <div className="flex flex-col relative z-10">
            <h2 className="text-6xl font-semibold tracking-tight text-white text-balance leading-tight">
              From Reel to Listing <br />
              <span className="text-indigo-600">in Under 2 Minutes.</span>
            </h2>
            <p className="text-gray-400 mt-5 text-lg max-w-xl">
              No editing skills. No SEO knowledge. No hours wasted. Just paste
              your link and Vidchemy handles the rest.
            </p>
          </div>

          <div className="relative mt-20 z-10">
            <div className="absolute top-9 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-600 to-transparent hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {steps.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative w-[72px] h-[72px] rounded-full bg-gray-900 border-2 border-gray-500/30 flex items-center justify-center text-indigo-400 group-hover:border-indigo-600/60  transition-all duration-300">
                    {item.icon}
                    <span className="absolute -top-2 -right-2 text-[15px] font-bold text-white bg-indigo-500 rounded-full w-7 h-7 flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-lg mt-5">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-30 border-4 border-gray-500/30 rounded-2xl bg-gray-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-white font-semibold text-xl">
                Ready to try it?
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Your first listing is one Reel away.
              </p>
            </div>
            <a
              href="#hero"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 whitespace-nowrap"
            >
              Get Started Free →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
