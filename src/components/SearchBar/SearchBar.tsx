const SearchBar: React.FC<SearchBarProps> = ({
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition ${className}`}>
      <svg
        className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        type="search"
        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 pl-8 text-sm"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
