import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { loginDjangoUser, getProfile,googleLogin } from '../../api/api';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { GoogleLogin } from '@react-oauth/google'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginDjangoUser({ email, password })
            const accessToken = res.data.access
            const refreshToken = res.data.refresh

            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)

            const profileRes = await getProfile(accessToken)
            const user = profileRes.data

            if (user.is_active === false) {
                localStorage.clear();
                toast.error("Account blocked. Contact support.")
                return
            }

            const isAdminUser =
                user && (
                    String(user.role).toLowerCase() === "admin" ||
                    user.is_staff ||
                    user.is_superuser
                );

            localStorage.setItem("isAdmin", isAdminUser ? "true" : "false")

            if (isAdminUser) {
                toast.success(`Welcome back, Admin ${user.username || ""}`)
                navigate("/adminpage/dashboard")
            } else {
                toast.success("Logged in successfully!")
                navigate("/")
            }

        } catch (err) {
            console.log(err)
            if (err.response?.status === 403) {
                toast.error("Your account is blocked!")
            } else {
                toast.error("Invalid credentials!")
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin({
        token: credentialResponse.credential

      })

      const { access, refresh, user } = res.data

      localStorage.setItem("accessToken",  access)
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
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 pt-24 relative overflow-hidden">

            {/* Background Aesthetics */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-70" />
            <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-50" />

            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-10 md:p-12">

                {/* Logo or Brand Heading */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white rounded-2xl mb-4 rotate-3 shadow-xl">
                        <FiLogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                        Welcome Back
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mt-2">Enter your credentials to continue</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div className="relative group">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-400 text-sm">OR</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                {/* ✅ Google button */}
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

                <div className="mt-10 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        New here? {" "}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login