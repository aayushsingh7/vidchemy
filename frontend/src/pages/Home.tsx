import { Dialog, DialogPanel } from "@headlessui/react";
import {
  UserGroupIcon,
  ChartBarIcon,
  VideoCameraIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  ArrowUpTrayIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { ArrowLongRightIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DropDown from "../components/DropDown";
import { useGuestAccount } from "../hooks/useGuestAccount";
import { useToast } from "../hooks/useToast";
import DialogBox from "../components/DialogBox";

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          productType,
          guestId,
          primarySourceUrl: null,
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
        "Optimized titles, bullet points, and keywords tailored for Amazon's A9 algorithm - written in seconds.",
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
      desc: "SEO titles, bullets, keywords — all optimized for A9.",
    },
    {
      step: "05",
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      title: "Publish & Sell",
      desc: "Export directly to Amazon or Flipkart Seller Central.",
    },
  ];

  return (
    <div className="bg-zinc-900">
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
          btn1Style="bg-zinc-700 hover:bg-zinc-600"
          btn2Style="bg-indigo-600 hover:bg-indigo-500"
          btn2Text="Continue"
          onBtn1Click={() => setShowDialog(false)}
          onBtn2Click={() => createNewJob(true)}
        />
      )}
      <section className="relative min-h-[100dvh] overflow-hidden bg-zinc-950">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />

        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.15),transparent)]" />

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent z-0" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] z-0 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[80px] z-0 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[80px] z-0 pointer-events-none" />

        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between px-8 py-6 lg:px-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  />
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Vidchemy
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a
                href="#"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Log in
              </a>
              <a
                href="#"
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Get Started
              </a>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden -m-2.5 p-2.5 text-gray-200"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </nav>

          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-zinc-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xl">Vidchemy</span>
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
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/5"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-white/5"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </header>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6 lg:px-8 text-center">
          <div className="mb-8 flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-sm font-medium tracking-wide">
              AI-Powered · Built for the World's Creator Economy
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-white text-balance leading-[1.1] max-w-5xl">
            From Video to
            <span className="relative inline-block text-indigo-500">
              Amazon Best-Seller
            </span>{" "}
            in Minutes.
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Stop wasting days on copywriting. Let AI extract the gold from your
            Reel and dominate the A9 algorithm - automatically.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createNewJob(false);
            }}
            className="mt-10 w-full max-w-2xl"
          >
            <div className="flex items-center gap-2 bg-zinc-900 border border-gray-500/30 rounded-2xl p-2 shadow-[0_0_40px_rgba(99,102,241,0.08)]">
              <DropDown
                options={productCategories}
                defaultTxt="Jacket"
                onSelect={setProductType}
              />
              <input
                onChange={(e: any) => setUrl(e.target.value)}
                value={url}
                type="url"
                placeholder="Paste your Instagram Reel link..."
                className="flex-1 h-12 bg-transparent outline-none text-lg placeholder-gray-500 text-white px-2"
                required
              />
              <button
                disabled={loading}
                type="submit"
                className="h-12 px-5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all duration-200 rounded-xl text-white font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <ArrowPathIcon
                    className="w-5 h-5"
                    style={{ animation: "spin 1.4s linear infinite" }}
                  />
                ) : (
                  <>
                    <span>Generate</span>
                    <ArrowLongRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-3">
              Supports Instagram Reels · Hindi & English · Amazon & Flipkart
            </p>
          </form>

          <div className="mt-14 flex items-center gap-8 flex-wrap justify-center">
            {[
              { value: "7×", label: "Faster than manual" },
              { value: "~2 min", label: "Per listing" },
              { value: "A9", label: "Algorithm optimized" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-white font-bold text-2xl">
                  {stat.value}
                </span>
                <span className="text-gray-500 text-sm mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="px-30 py-10">
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
                <div className="border-2 border-gray-500/30 p-5 bg-zinc-900 rounded-[10px]">
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

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {steps.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative w-[72px] h-[72px] rounded-full bg-zinc-900 border-2 border-gray-500/30 flex items-center justify-center text-indigo-400 group-hover:border-indigo-600/60  transition-all duration-300">
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

          <div className="mt-30 border-4 border-gray-500/30 rounded-2xl bg-zinc-900 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-white font-semibold text-xl">
                Ready to try it?
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Your first listing is one Reel away.
              </p>
            </div>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 whitespace-nowrap">
              Get Started Free →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
