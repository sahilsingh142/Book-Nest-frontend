import { useEffect, useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiBriefcase, } from "react-icons/fi";
import axios from 'axios'
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

function AuthInput({ icon: Icon, delay, ...inputProps }) {
  return (
    <div
      className="field-anim auth-input flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3"
      style={{ animationDelay: delay }}
    >
      <Icon size={16} className="text-zinc-400" />
      <input {...inputProps} className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none" />
    </div>
  );
}

export default function AuthPage() {

  const location = useLocation();
  const [mode, setMode] = useState("signup");
  const isSignup = mode === "signup";
  const [role, setRole] = useState(location.state?.role || "Customer");
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, []);

  const [isSignUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
    role: role
  });

  const [isLogin, setLogin] = useState({
    email: '',
    password: '',
    role: role
  })

  const handleRole = (selectedRole) => {
    setRole(selectedRole);

    setSignUp(prev => ({ ...prev, role: selectedRole }));

    setLogin(prev => ({ ...prev, role: selectedRole }));
  };

  const handleSignInput = (e) => {
    setSignUp({ ...isSignUp, [e.target.name]: e.target.value });
  }

  const handleSignUpData = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5600/auth/signup',
        isSignUp
      )
      toast.success("Signup Successful");
    }
    catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        errors.forEach((error) => {
          toast.error(error.message);
        });
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  }

  const handleLoginInput = (e) => {
    setLogin({ ...isLogin, [e.target.name]: e.target.value });
  }

  const handleLoginData = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5600/auth/login",
        isLogin,
        {
          withCredentials: true,
        }
      );

      const role = res.data.data.role;

      if (role === "Business") {
        try {
          await axios.get(
            "http://localhost:5600/fromData/businessProfile",
            {
              withCredentials: true,
            }
          );

          navigate("/businesProfile");

        } catch (err) {
          if (err.response?.status === 404) {
            navigate("/business");
          } else {
            toast.error("Something went wrong");
          }
        }

      } else {
        navigate("/customer");
      }

      toast.success("Login Successful");

    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        errors.forEach((error) => toast.error(error.message));
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleSubmit = (e) => {
    if (mode === "signup") {
      handleSignUpData(e);
    } else {
      handleLoginData(e);
    }
  }

  const checkLogin = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5600/protected/me",
        {
          withCredentials: true,
        }
      );

      if (data.user.role === "Business") {

        try {
          await axios.get(
            "http://localhost:5600/fromData/businessProfile",
            {
              withCredentials: true,
            }
          );

          // Agar request successful hui to profile exist karti hai
          navigate("/businesProfile");

        } catch (err) {

          if (err.response?.status === 404) {
            // Profile nahi bani
            navigate("/business");
          } else {
            toast.error("Something went wrong");
          }
        }

      } else {
        navigate("/customer");
      }

    } catch (err) {
      toast.error("Please login first");
      navigate("/auth");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-zinc-100 via-zinc-100 to-zinc-400 p-4">

      <div className="panel relative z-10 w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl sm:p-10">

        <div className="relative mb-8 flex border-b border-zinc-200">

          <button onClick={() => setMode("signup")}
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-300 ${mode === "signup" ? "text-zinc-900" : "text-zinc-400"}`}>
            Create Account
          </button>

          <button onClick={() => setMode("signin")}
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-300 ${mode === "signin" ? "text-zinc-900" : "text-zinc-400"}`} >
            Sign In
          </button>

          <div
            className="absolute bottom-0 h-0.5 w-1/2 bg-emerald-500 transition-all duration-300"
            style={{
              transform: mode === "signup" ? "translateX(0%)" : "translateX(100%)",
            }}
          />
        </div>

        <div key={mode}>

          {isSignup && (
            <div className="mb-4">
              <label className="mb-2 block text-xs text-zinc-500">Full name</label>
              <AuthInput
                icon={FiUser} delay="90ms"
                type="text"
                placeholder="Aditi Sharma"
                name="name"
                onChange={handleSignInput}
                required />
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-xs text-zinc-500">Email address</label>
            <AuthInput
              icon={FiMail}
              delay={isSignup ? "140ms" : "40ms"}
              type="email"
              placeholder="you@example.com"
              name="email"
              onChange={isSignup ? handleSignInput : handleLoginInput}
              required
            />
          </div>

          <div className="mb-2">

            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs text-zinc-500">Password</label>
            </div>

            <div className="field-anim auth-input flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3" style={{ animationDelay: isSignup ? "190ms" : "90ms" }}>
              <FiLock size={16} className="text-zinc-400" />
              <input
                type="password"
                placeholder="••••••••"
                required
                name="password"
                onChange={isSignup ? handleSignInput : handleLoginInput}
                className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="mb-2 block font-medium text-xs text-zinc-500">
              Select Role
            </label>

            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => handleRole("Customer")}
                className={`field-anim flex-1 rounded-xl border py-2 text-sm font-medium duration-300 cursor-pointer ${role === "Customer"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 "
                  : "border-zinc-200 text-zinc-300"
                  }`}
                style={{ animationDelay: isSignup ? "240ms" : "140ms" }}
              >
                Customer
              </button>

              <button
                type="button"
                onClick={() => handleRole("Business")}
                className={`field-anim flex-1 rounded-xl border py-2 text-sm font-medium duration-300 cursor-pointer ${role === "Business"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600 "
                  : "border-zinc-200 text-zinc-300 "
                  }`}
                style={{ animationDelay: isSignup ? "240ms" : "140ms" }}
              >
                Business
              </button>
            </div>

          </div>

          <button onClick={handleSubmit}
            className="field-anim group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-emerald-600"
            style={{ animationDelay: isSignup ? "240ms" : "140ms" }} >
            {isSignup ? "Create Account" : "Sign In"}
            <FiArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>

        </div>
      </div>
    </div>
  )
}