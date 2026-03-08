import {
  Bars3Icon,
  HomeIcon,
  QueueListIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, current: true },
  { name: 'Listings', href: '/dashboard/listings', icon: QueueListIcon, current: false },
];

const SideNav = ()=>  {
  const [active,setActive] = useState<string>("Home")
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="shrink-0 flex h-screen bg-gray-900 overflow-hidden font-sans">
      <div 
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-800">
          <span className="text-xl font-bold text-white tracking-tight">VidChemy</span>
          <button className="lg:hidden text-gray-400" onClick={() => setIsOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-3 space-y-1">
          {navigation.map((item) => (
            <Link
            onClick={()=> setActive(item.name)}
              key={item.name}
              to={item.href}
              className={`group flex items-center gap-x-3 rounded-lg px-3 py-2 text-lg font-medium transition-colors ${
                active === item.name 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="h-6 w-6 shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center border-b border-gray-800 bg-gray-900 px-4 lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-400 focus:outline-none"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <span className="ml-4 text-white font-semibold">Dashboard</span>
        </header>
      </div>
    </div>
  );
}

export default SideNav;