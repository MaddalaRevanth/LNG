import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { serverUrl } from "../main";

function SideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(
    (state) => state.user
  );

  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  useEffect(() => {
    if (input) handleSearch();
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] w-full h-full overflow-hidden bg-slate-200 relative ${
        selectedUser ? "hidden lg:block" : "block"
      }`}
    >
      {/* Logout Button */}
      <div
        className="w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-[#333333] shadow-gray-500 text-white cursor-pointer shadow-lg fixed bottom-[20px] left-[10px]"
        onClick={handleLogOut}
      >
        <BiLogOutCircle className="w-[25px] h-[25px]" />
      </div>

      {/* Search Results */}
      {input && (
        <div className="absolute top-[250px] bg-white w-full h-[500px] overflow-y-auto flex flex-col gap-[10px] z-[150] shadow-lg pt-[20px]">
          {searchData?.map((user) => (
            <div
              key={user._id}
              className="w-[95%] h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-[#e0e0e0] border-b-2 border-gray-400 cursor-pointer"
              onClick={() => {
                dispatch(setSelectedUser(user));
                setInput("");
                setSearch(false);
              }}
            >
              <div className="relative rounded-full bg-white flex justify-center items-center">
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                  <img src={user.image || dp} alt="" className="h-full w-full object-cover" />
                </div>
                {onlineUsers?.includes(user._id) && (
                  <span className="w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-md"></span>
                )}
              </div>
              <h1 className="text-gray-800 font-semibold text-[20px]">
                {user.name || user.userName}
              </h1>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="w-full h-[300px] bg-[#333333] rounded-b-[30%] shadow-lg px-[20px] flex flex-col justify-center">
        <h1 className="text-white font-bold text-[25px]">LNG</h1>
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-[25px]">
            Hii, {userData?.name || "User"}
          </h1>
          <div
            className="w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg"
            onClick={() => navigate("/profile")}
          >
            <img src={userData?.image || dp} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Search / Online Users */}
        <div className="w-full flex items-center gap-[20px] py-[18px]">
          {!search ? (
            <div
              className="w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg"
              onClick={() => setSearch(true)}
            >
              <IoIosSearch className="w-[25px] h-[25px]" />
            </div>
          ) : (
            <form className="w-full h-[60px] bg-white shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full px-[20px] relative">
              <IoIosSearch className="w-[25px] h-[25px]" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full h-full text-[17px] outline-none border-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <RxCross2
                className="w-[25px] h-[25px] cursor-pointer"
                onClick={() => {
                  setSearch(false);
                  setInput("");
                }}
              />
            </form>
          )}

          {!search &&
            otherUsers?.filter((u) => onlineUsers?.includes(u._id)).map((user) => (
              <div
                key={user._id}
                className="relative rounded-full bg-white shadow-lg cursor-pointer mt-[10px]"
                onClick={() => dispatch(setSelectedUser(user))}
              >
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                  <img src={user.image || dp} alt="" className="h-full w-full object-cover" />
                </div>
                <span className="w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-md"></span>
              </div>
            ))}
        </div>
      </div>

      {/* Other Users List */}
      <div className="w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]">
        {otherUsers?.map((user) => (
          <div
            key={user._id}
            className="w-[95%] h-[60px] flex items-center gap-[20px] bg-white shadow-lg rounded-full hover:bg-[#e0e0e0] cursor-pointer px-4"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative rounded-full bg-white flex justify-center items-center">
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                <img src={user.image || dp} alt="" className="h-full w-full object-cover" />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-md"></span>
              )}
            </div>
            <h1 className="text-gray-800 font-semibold text-[20px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
