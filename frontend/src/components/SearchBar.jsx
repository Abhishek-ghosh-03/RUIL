import { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className="relative group w-full max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-gray-100/50 rounded-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>
      <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm transition-all duration-300 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10 active:scale-[0.99]">
        <Search className="text-gray-400 mr-3 w-5 h-5" />
        <input
          type="text"
          placeholder="Search components or libraries..."
          className="w-full bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base font-medium"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default SearchBar;