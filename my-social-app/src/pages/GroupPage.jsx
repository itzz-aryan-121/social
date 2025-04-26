import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const GroupPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/groups");
        const data = await response.json();

        if (response.ok) {
          setGroups(data);
        } else {
          toast.error(data.message || "Failed to fetch groups");
        }
      } catch (error) {
        toast.error("Error connecting to server");
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    // This would be expanded in a real implementation
    toast.info("Group creation will be implemented soon!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Groups</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join groups to connect with others who share your interests
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {currentUser && (
          <button
            onClick={handleCreateGroup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Create New Group
          </button>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No groups found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Try a different search term"
              : "Be the first to create a group!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Link
              to={`/group/${group.id}`}
              key={group.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="h-40 bg-gray-300 dark:bg-gray-700">
                {group.coverImage ? (
                  <img
                    src={group.coverImage}
                    alt={`${group.name} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
                    <span className="text-white text-2xl font-bold">
                      {group.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {group.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{group.memberCount || 0} members</span>
                  <span className="mx-2">•</span>
                  <span>{group.postCount || 0} posts</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupPage;
