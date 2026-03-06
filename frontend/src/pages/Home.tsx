import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";

const navigation = [];

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gray-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
           
          </div>
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
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm/6 font-semibold text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
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
           From Video to <span className="text-indigo-600">Amazon Best-Seller</span> in <span className="relative">
             <span className="absolute right-0 w-full h-[4px] bottom-[-3px] bg-indigo-600 block"></span>
             <span className="absolute left-0 w-[80%] h-[4px] bottom-[-15px] bg-indigo-600 block"></span>
             Minutes</span>.
          </h1>
          <p className="mt-10 text-2xl max-w-2xl text-gray-400 text-center">Stop wasting days on copywriting - let AI extract the gold from your post and dominate the A9 algorithm.</p>
          <form className="mt-10 max-w-2xl flex items-center border gap-2 bg-gray-800 border-gray-500/30 h-17  w-full rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Enter Youtube Shorts or Instagram Reel Link"
              className="w-full h-full pl-6 outline-none text-xl placeholder-gray-400 text-white"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 active:scale-95 transition w-56 h-14  rounded-full text-xl font-bold text-white mr-1 flex items-center justify-center"
            >
              Generate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
