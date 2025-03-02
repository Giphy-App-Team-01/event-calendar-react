import React, { useEffect, useState } from "react";
import { getAllUsers, databaseUser } from "../../services/db-service";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search users...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<databaseUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<databaseUser[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getAllUsers();
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers([]);
      return;
    }

    const results = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(results);
  }, [searchTerm, users]);

  return (
    <div className="relative w-full max-w-sm">
      <div className={`relative flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition ${className}`}>
        <svg
          className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
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
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 pl-10 text-sm"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredUsers.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all rounded-lg"
              onClick={() => {
                navigate(`/user/${user.uid}`);
                setSearchTerm("");
              }}
            >
              <img
                src={user.image}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <p className="text-gray-800 font-medium">{user.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
