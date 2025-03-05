import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onChange: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className={'relative w-full max-w-sm'}>
      <div className="relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
        <svg
          className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 pl-10 text-sm"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
