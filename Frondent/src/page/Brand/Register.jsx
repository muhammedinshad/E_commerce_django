import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerDjangoUser, googleLogin } from "../../api/api";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { GoogleLogin } from '@react-oauth/google'

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const signUpData = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerDjangoUser(form)
      .then(() => {
        toast.success("Welcome to the collection!");
        navigate("/login");
      })
      .catch((error) => {
        const errors = error.response?.data;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            toast.error(`${key}: ${errors[key][0]}`);
          });
        } else {
          toast.error("Something went wrong!");
        }
      });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin({
        token: credentialResponse.credential

      })

      const { access, refresh, user } = res.data

      localStorage.setItem("accessToken", access)
      localStorage.setItem("refreshToken", refresh)
      if (user.role == "admin") {
        localStorage.setItem("isAdmin", "true")
        toast.success("Welcome Admin!")
        navigate("/adminpage/dashboard")
      } else {
        localStorage.setItem("isAdmin", "false")
        toast.success("Google login successful!")
        navigate("/")
      }

    } catch (err) {
      const msg = err.response?.data?.error
      toast.error(msg || "Google login failed!")
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 pt-24">
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-slate-200 rounded-full blur-3xl opacity-60"></div>

      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Join our exclusive community today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={signUpData}
              value={form.username}
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={signUpData}
              value={form.email}
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={signUpData}
              value={form.password}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              onChange={signUpData}
              value={form.confirm_password}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Sign Up <FiArrowRight />
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
            useOneTap
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width="300"
          />
        </div>
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;