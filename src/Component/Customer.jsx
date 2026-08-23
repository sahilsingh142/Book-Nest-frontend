import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { FiSearch, FiUser, FiMapPin, FiPhone, FiBriefcase, FiX } from "react-icons/fi";
import { BiLogOutCircle } from "react-icons/bi";
import { io } from "socket.io-client";

const CATEGORIES = ['Gym', 'Salon', 'Restaurant', 'Cafe', 'Clinic', 'Hotel', 'Marriage Hall'];

const socket = io("http://localhost:5600", {
  withCredentials: true
});

function initialsOf(name = '') {
  return name.trim().charAt(0).toUpperCase() || '?';
}

function Customer() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [businessData, setBusinessData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const getCustomerPage = async () => {
      try {
        const res = await axios.get('http://localhost:5600/protected/customer',
          {
            withCredentials: true
          }
        )
        setCustomerData(res.data.user);
      }
      catch (err) {
        toast.error("Unauthorized")
        navigate("/auth")
      }
    }
    getCustomerPage();
  }, [])

  useEffect(() => {
    const getBusinessData = async () => {
      try {
        const res = await axios.get('http://localhost:5600/fromData/all',
          { withCredentials: true }
        )
        setBusinessData(res.data.data);
      }
      catch (err) {
        toast.error("Cannot get data");
      }
    }
    getBusinessData();
  }, [])

  useEffect(() => {
    const handleBusinessStatusUpdate = (data) => {

      setBusinessData((prevData) => {
        return prevData.map((business) => {
          if (business._id === data.businessId) {
            return {
              ...business,
              status: data.status,
              waitTime: data.waitTime
            }
          }
          return business;
        });
      });
    };

    socket.on(
      "businessStatusUpdated",
      handleBusinessStatusUpdate
    );

    return () => {

      socket.off(
        "businessStatusUpdated",
        handleBusinessStatusUpdate
      );

    };

  }, []);

  const filteredBusiness = useMemo(() => {
    return businessData.filter((business) => {
      const matchesSearch = business.businessName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || business.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [businessData, search, activeCategory]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5600/auth/logout', {},
        {
          withCredentials: true,
        }
      )
      navigate("/");
      toast.success("Logout Successful")
    }
    catch (err) {
      toast.error("Logout Failed")
    }
  }

  const sendNotification = async (businessId) => {
    try {

      const res = await axios.post(
        "http://localhost:5600/fromData/notifyOwner",
        {
          businessId
        },
        {
          withCredentials: true
        }
      );

      console.log(res.data);

    } catch (error) {

      console.log(
        "Notification Error:",
        error.response?.data
      );

    }
  };


  if (!customerData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-500" />
        <span className="text-sm font-medium tracking-wide text-zinc-400">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* Nav */}
      <nav className="sticky top-0 z-20 border-b border-zinc-200/80 bg-zinc-50/70 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <h1 className="group flex cursor-pointer text-xl font-black tracking-tight">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">BOOK</span>
            <span className="inline-block text-emerald-500 transition-transform duration-300 group-hover:translate-y-1">NEST</span>
          </h1>

          <div className="relative w-full max-w-md">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              className="w-full rounded-full border border-zinc-300 bg-white py-2.5 pl-11 pr-10 text-sm font-medium text-zinc-700 outline-none transition-colors focus:border-emerald-500"
              type="text"
              placeholder="Search business..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 sm:flex">
            <FiUser className="text-emerald-500" />
            <span className="text-sm font-bold tracking-wider text-zinc-800">{customerData.name}</span>
          </div>
        </div>
      </nav>

      {/* Category filter */}
      <section className="relative mx-auto max-w-7xl px-6 sm:px-10">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-150 w-150 md:h-200 md:w-200 rounded-full bg-emerald-500/7 shadow-2xl shadow-zinc-300 blur-6xl" />
        </div>


        <div className="flex flex-wrap gap-2 pt-10">

          <button onClick={() => setActiveCategory("All")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${activeCategory === "All"
              ? "bg-zinc-900 text-white shadow-md" : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:-translate-y-0.5 hover:ring-emerald-400"}`}>
            All
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:-translate-y-0.5 hover:ring-emerald-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Business grid */}
      <section className="relative mx-auto max-w-7xl px-6 py-10 sm:px-10">
        {filteredBusiness.length === 0 ? (
          <div className="bn-rise flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/60 py-20 text-center">
            <FiBriefcase className="text-3xl text-zinc-300" />
            <p className="font-semibold text-zinc-500">No businesses match right now</p>
            <p className="text-sm text-zinc-400">Try a different search term or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 ">
            {filteredBusiness.map((business, i) => (

              <div key={business._id}
                className="bn-rise bn-ticket group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200"
              >
                <span className="absolute right-4 top-4 rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {business.category}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 tracking-wider items-center justify-center rounded-xl bg-emerald-50 text-xl font-black text-emerald-600">
                    {initialsOf(business.businessName)}
                  </div>
                  <h3 className="pr-16 text-xl font-extrabold leading-tight tracking-tight text-zinc-600">
                    {business.businessName}
                  </h3>
                </div>

                <div className="relative my-5 border-t border-dashed border-zinc-300" />

                <div className="space-y-2.5 flex justify-between">
                  <div >
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <FiMapPin className="shrink-0 text-emerald-500" />
                      <p>{business.city}, <span>{business.village}</span></p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-zinc-600">
                      <FiPhone className="shrink-0 text-emerald-500" />
                      <p className="font-mono">{business.number}</p>
                    </div>
                  </div>

                  <div className='flex justify-center'>
                    <button
                      onClick={() => sendNotification(business._id)}
                      className="px-6 py-2 text-sm font-medium rounded-full bg-mauve-600 text-zinc-200 hover:scale-95 duration-200 hover:bg-mauve-700 cursor-pointer"
                    >
                      Notify Me
                    </button>
                  </div>

                  {
                    business.status === "busy" ? (
                      <div className="flex justify-center gap-3 pt-5">
                        <div className="flex justify-center items-center">
                          <span className="font-bold tracking-widest text-sm text-red-500">
                            Busy
                          </span>
                        </div>

                        <h1 className="font-black font-mono tracking-wider border px-3 py-1 rounded-2xl bg-zinc-200">
                          {business.waitTime >= 60
                            ? `${Math.floor(business.waitTime / 60)}h ${business.waitTime % 60 ? `${business.waitTime % 60}m` : ""
                            }`
                            : `${business.waitTime}m`}
                        </h1>
                      </div>
                    ) : (
                      <span className="font-bold tracking-widest text-sm text-emerald-500 mt-5">
                        Available
                      </span>
                    )
                  }
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white cursor-pointer transition-all duration-300 hover:scale-95 hover:bg-emerald-600"
        >
          <span>Log Out</span>
          <BiLogOutCircle size={20} />
        </button>
      </div>
    </div>
  )
}

export default Customer