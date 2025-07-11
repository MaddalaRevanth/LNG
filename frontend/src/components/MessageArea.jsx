import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { setSelectedUser } from "../redux/userSlice";
import dp from "../assets/dp.webp";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { serverUrl } from "../main";

function MessageArea() {
  const dispatch = useDispatch();
  const image = useRef();

  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessages([...messages, res.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
      setShowPicker(false);
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (mess) => {
      dispatch(setMessages((prev) => [...prev, mess]));
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, dispatch]);

  return (
    <div
      className={`lg:w-[70%] relative ${
        selectedUser ? "flex" : "hidden"
      } lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-300 overflow-hidden`}
    >
      {selectedUser ? (
        <div className="w-full h-[100vh] flex flex-col overflow-hidden gap-[20px] items-center">
          {/* Top Bar */}
          <div className="w-full h-[100px] bg-[#333333] rounded-b-[30px] shadow-gray-400 shadow-lg gap-[20px] flex items-center px-[20px]">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px] text-white" />
            </div>
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg">
              <img
                src={selectedUser?.image || dp}
                alt="Profile"
                className="h-[100%]"
              />
            </div>
            <h1 className="text-white font-semibold text-[20px]">
              {selectedUser?.name || "User"}
            </h1>
          </div>

          {/* Chat Messages */}
          <div className="w-full h-[70%] flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px]">
            {showPicker && (
              <div className="absolute bottom-[120px] left-[20px] z-50">
                <EmojiPicker
                  width={250}
                  height={350}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}

            {messages?.map((mess) =>
              mess.sender === userData._id ? (
                <SenderMessage
                  key={mess._id}
                  image={mess.image}
                  message={mess.message}
                />
              ) : (
                <ReceiverMessage
                  key={mess._id}
                  image={mess.image}
                  message={mess.message}
                />
              )
            )}
          </div>

          {/* Chat Input */}
          <div className="w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center">
            {frontendImage && (
              <img
                src={frontendImage}
                alt="Preview"
                className="w-[80px] absolute bottom-[100px] right-[20%] rounded-lg shadow-gray-400 shadow-lg"
              />
            )}
            <form
              className="w-[95%] lg:w-[70%] h-[60px] bg-[#333333] shadow-gray-400 shadow-lg rounded-full flex items-center gap-[20px] px-[20px] relative"
              onSubmit={handleSendMessage}
            >
              <div onClick={() => setShowPicker((prev) => !prev)}>
                <RiEmojiStickerLine className="w-[25px] h-[25px] text-white cursor-pointer" />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={image}
                hidden
                onChange={handleImage}
              />
              <input
                type="text"
                className="w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white"
                placeholder="Message"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <div onClick={() => image.current.click()}>
                <FaImages className="w-[25px] h-[25px] cursor-pointer text-white" />
              </div>
              {(input || backendImage) && (
                <button type="submit">
                  <RiSendPlane2Fill className="w-[25px] h-[25px] text-white cursor-pointer" />
                </button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-gray-700 font-bold text-[50px]">Welcome to LNG</h1>
          <span className="text-gray-700 font-semibold text-[30px]">
            Chat Friendly!
          </span>
        </div>
      )}
    </div>
  );
}

export default MessageArea;
