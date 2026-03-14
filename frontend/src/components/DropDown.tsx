import React, { useState, useRef, useEffect } from 'react';

interface ProductDropdownProps {
  options: string[];
  defaultTxt:string;
  onSelect?: (option: string) => void;
}

const DropDown: React.FC<ProductDropdownProps> = ({ options, onSelect, defaultTxt }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(defaultTxt);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-[10px] w-40 bg-zinc-800  h-14 whitespace-nowrap inline-flex items-center justify-between text-white bg-brand box-border  hover:bg-brand-strong border-2 border-gray-500/30 shadow-xs font-medium leading-5 text-md px-4 py-2.5 outline-none"
        type="button"
      >
        {selectedOption}
        {/* Added a slight rotation to the arrow when open for better UX */}
        <svg
          className={`shrink-0  w-4 h-4 ms-1.5 -me-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="overflow-scroll rounded-[10px] h-[150px] bg-zinc-800 absolute z-10 mt-3 left-0 bg-neutral-primary-medium border border-default-medium border-2 border-gray-500/30 shadow-lg w-44">
          <ul className="p-2 text-md text-white text-body font-medium">
            {options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSelect(option)}
                  className="hover:bg-zinc-700 inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded text-left"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDown;