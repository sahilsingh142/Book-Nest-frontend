import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";

function Customer() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [businessData, setBusinessData] = useState([]);
  const [search, setSearch] = useState("");

  const filteredBusiness = businessData.filter((business) =>
    business.businessName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          {
            withCredentials: true
          }
        )
        setBusinessData(res.data.data);
      }
      catch (err) {
        toast.error("Cannot get data");
      }
    }

    getBusinessData();
  }, [])

  if (!customerData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 text-sm text-zinc-400">
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <div className='relative'>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-150 w-150 md:h-200 md:w-200 rounded-full bg-emerald-500/7 shadow-2xl shadow-zinc-300 blur-6xl" />
        </div>

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
          <h1 className="group flex cursor-pointer text-xl font-semibold tracking-tight">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">Book</span>
            <span className="inline-block font-bold text-emerald-500 transition-transform duration-300 group-hover:translate-y-1">Nest</span>
          </h1>
          <input className='border px-3 py-3 text-sm font-medium border-zinc-400 bg-zinc-100 rounded-2xl w-[60%] sm:w-[30%]'
            type="text"
            placeholder="Search business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <h1 className="font-bold tracking-wide text-zinc-800 hidden sm:flex">{customerData.name}</h1>
        </nav>

        <div className='p-5 flex gap-5 flex-col items-center'>
          {
            filteredBusiness.map((business) => (
              <div key={business._id}
              className='w-[80%]  px-4 py-3 rounded-xl bg-zinc-100 text-zinc-700'
              >
                <span className='font-medium tracking-widest px-2 py-1 text-emerald-500'>{business.category}</span>
                <h2 className='text-3xl font-bold tracking-wider mt-1'>{business.businessName}</h2>
                <p className='mt-1 text-zinc-500'>{business.city}, <span>{business.village}</span></p>
                <p>{business.number}</p>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Customer
