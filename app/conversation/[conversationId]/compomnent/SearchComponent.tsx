"use client";
import Loading from "@/app/loading";
import { Conversation, User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { HiSearch, HiX } from "react-icons/hi"; // Import HiArrowLeft for the "close" icon
import { HiArrowUturnUp } from "react-icons/hi2";
interface SearchComponentprops {
  convo: Conversation & {
    users: User[];
  };
}
const SearchComponent: React.FC<SearchComponentprops> = ({ convo }) => {
  const [searchedMsg, setSearchedMsg] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchMsg = () => {
    setLoading(true);
    axios
      .post("/api/search", {
        conversationId: convo.id,
        seachVal: searchedMsg,
      })
      .then(() => {
        setSearchedMsg("");
      })
      .finally(() => {
        setLoading(false);
      });
    setShowInput(false);
  };

  const handleToggleInput = () => {
    setShowInput((prev) => !prev); // Toggle visibility of the input
  };

  return (
    <div className="relative">
      {loading && <Loading />}
      {/* Modal Background Overlay */}
      {showInput && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowInput(false)}
        />
      )}

      {/* Modal Input Box */}
      {showInput && (
        <div className="fixed inset-0 z-50 flex justify-center items-center ">
          <HiX
            className="fixed top-0 right-0 z-50 bg-gray-100 m-2 cursor-pointer"
            size={20}
            onClick={() => setShowInput(false)}
          />
          <div className="bg-white rounded-lg p-4 w-4/5 md:w-1/3 shadow-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Find Message"
                className="p-2 focus:outline-none w-full"
                onChange={(e) => setSearchedMsg(e.target.value)}
                value={searchedMsg}
              />

              <div
                className="w-10 h-10 flex items-center justify-center cursor-pointer"
                onClick={handleSearchMsg}
              >
                <HiArrowUturnUp size={20} className="text-sky-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Normal View (When Input is Hidden) */}
      {!showInput && (
        <div className="w-full flex gap-1 items-center justify-between">
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer">
            <HiSearch
              size={28}
              className="text-sky-500"
              onClick={handleToggleInput} // Open the search input when clicked
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
