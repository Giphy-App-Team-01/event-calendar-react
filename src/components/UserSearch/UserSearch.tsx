import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/db-service";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import { databaseUser } from "../../types/interfaces";

const UserSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<databaseUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<databaseUser[]>([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  return (
    <div className="relative w-full max-w-sm">
      <SearchBar
        searchTerm={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search users..."
      />
      {searchTerm && filteredUsers.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all rounded-lg"
              onClick={() => navigate(`/user/${user.uid}`)}
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

export default UserSearch;
