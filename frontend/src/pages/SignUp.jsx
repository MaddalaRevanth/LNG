import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      );

     

      // ✅ Update Redux state
      dispatch(setUserData(user));
      navigate("/profile");
      // Clear input fields
      setUserName("");
      setEmail("");
      setPassword("");
      setLoading(false)
      setErr(false)
    } catch (error) {
      console.error("Signup error:", error);
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        {/* Header */}
        <div className="w-full h-[220px] bg-[#333333] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col items-center justify-center gap-2">
          <img
            src="/logo.jpg"
            alt="LNG Logo"
            className="w-[80px] h-[80px] rounded-full border-4 border-white shadow-lg object-cover"
          />
          <h1 className="text-white font-bold text-[24px] mt-2">
            Welcome to <span className="text-gray-300">LNG</span>
          </h1>
          <p className="text-white text-[14px] italic">Live Network & Games</p>
        </div>

        {/* Signup Form */}
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={handleSignUp}
        >
          <input
            type="text"
            placeholder="username"
            className="w-[90%] h-[50px] outline-none border-2 border-[#333333] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <input
            type="email"
            placeholder="email"
            className="w-[90%] h-[50px] outline-none border-2 border-[#333333] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="w-[90%] h-[50px] border-2 border-[#333333] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative">
            <input
              type={show ? "text" : "password"}
              placeholder="password"
              className="w-full h-full outline-none px-[20px] py-[10px] bg-white text-gray-700 text-[19px]"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute top-[10px] right-[20px] text-[19px] text-[#333333] font-semibold cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "hidden" : "show"}
            </span>
          </div>

          {err && <p className="text-red-500">{"*" + err}</p>}

          <button
            className="px-[20px] py-[10px] bg-[#333333] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold text-white hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <p className="cursor-pointer" onClick={() => navigate("/login")}>
            Already Have An Account?{" "}
            <span className="text-[#333333] font-bold">Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
