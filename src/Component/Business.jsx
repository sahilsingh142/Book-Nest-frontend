import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import { BiLogOutCircle } from "react-icons/bi";
import { menuData } from '../Data/ExtraData';

function Business() {

  const navigate = useNavigate();
  const [isCategory, setCategory] = useState("");
  const currentMenu = menuData[isCategory];
  const [busiName, setBusiName] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [city, setCity] = useState("");
  const [number, setNumber] = useState("");
  const [prices, setPrices] = useState({});
  const services = Object.entries(prices).map(([name, price]) => ({
    name,
    price: Number(price)
  }));

  useEffect(() => {
    getBusinessPage();
  }, [])

  const getBusinessPage = async () => {
    try {
      await axios.get('http://localhost:5600/protected/business',
        {
          withCredentials: true
        }
      )
    }
    catch (err) {
      toast.error("Unauthorized")
      navigate("/auth")
    }
  }
  const handleCategory = (e) => {
    setCategory(e.target.value);
  }

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

  const handlePrice = (e) => {
    setPrices({ ...prices, [e.target.name]: e.target.value });
  };

  const handleFormData = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5600/fromData/businessData",
        {
          category: isCategory,
          businessName: busiName,
          ownerName: name,
          village,
          city,
          number,
          services,
        },
        {
          withCredentials: true,
        }
      );
      navigate('/businesProfile')
      toast.success("Data Submitted");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div>
        <nav className='flex justify-between p-5'>
          <h1 className='group font-semibold tracking-tight text-xl cursor-pointer flex'>
            <span className='inline-block transition-transform duration-300 group-hover:-translate-y-1'>
              Book
            </span>
            <span className='inline-block transition-transform duration-300 group-hover:translate-y-1 text-emerald-500 font-bold'>
              Nest
            </span>
          </h1>
          <button onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white cursor-pointer transition-all duration-300 hover:scale-95 hover:bg-emerald-600">
            <span>Log Out</span>
            <BiLogOutCircle size={20} />
          </button>
        </nav>

        <form onSubmit={handleFormData} className='w-full flex justify-center sm:mt-5 pr-8 pl-8'>

          <div className='w-full max-w-3xl border border-zinc-200 rounded-xl p-3'>

            <div>
              <p className='text-[10px] text-emerald-600 tracking-wider font-medium'>BUSINESS SETUP</p>
              <h1 className='text-2xl font-bold tracking-wider text-zinc-600'>Fill Business Information</h1>
            </div>

            <div>

              <div className='flex flex-col pt-2 sm:pt-5 text-sm font-medium'>
                <label>
                  Business Category
                </label>

                <select name="category" onChange={handleCategory}
                  className='border border-zinc-200 mt-1 bg-zinc-100 rounded-xl px-3 py-2.5 cursor-pointer outline-none focus:border-emerald-500 appearance-none text-zinc-500'
                >
                  <option value="">Select Category</option>
                  <option value="Gym">Gym</option>
                  <option value="Salon">Salon</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Marriage hall">Marriage Hall</option>
                </select>
              </div>

              <div className='grid grid-cols-2 gap-5 pt-5 text-sm font-medium text-zinc-700'>
                <div className='flex flex-col'>
                  <label>Business Name</label>
                  <input
                    type="text"
                    placeholder='Fit Zone Gym'
                    value={busiName}
                    onChange={(e) => setBusiName(e.target.value)}
                    className='outline-none bg-zinc-100 mt-1 px-3 py-2.5 border border-zinc-300 rounded-xl' />
                </div>

                <div className='flex flex-col '>
                  <label >Your Name</label>
                  <input
                    type="text"
                    placeholder='Aditya Singh'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='outline-none bg-zinc-100 mt-1 px-3 py-2.5 border border-zinc-300 rounded-xl' />
                </div>

                <div className='flex flex-col'>
                  <label >Village</label>
                  <input
                    type="text"
                    placeholder='Puri'
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className='bg-zinc-100 mt-1 outline-none px-3 py-2.5 border border-zinc-300 rounded-xl' />
                </div>

                <div className='flex flex-col'>
                  <label >City</label>
                  <input
                    type="text"
                    placeholder='Lucknow'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className='bg-zinc-100 mt-1 outline-none px-3 py-2.5 border border-zinc-300 rounded-xl' />
                </div>

                <div className='flex flex-col'>
                  <label >Phone no</label>
                  <input
                    type="tel"
                    placeholder='987-362-829'
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className='bg-zinc-100 mt-1 outline-none px-3 py-2.5 border border-zinc-300 rounded-xl' />
                </div>
              </div>

              {currentMenu && (
                <div className="mt-4 sm:mt-8 rounded-2xl border border-zinc-300 p-5">

                  <h2 className="mb-5 sm:text-lg font-semibold text-zinc-800">
                    {currentMenu.title}
                  </h2>

                  <div className="space-y-4">

                    {currentMenu.items.map((item) => (
                      <div key={item} className="grid grid-cols-[180px_1fr] items-center gap-4">

                        <span className="text-sm font-medium text-zinc-700">{item}</span>

                        <div className="relative">

                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                          <input
                            type="number"
                            placeholder="Enter Price"
                            name={item}
                            value={prices[item] || ""}
                            onChange={handlePrice}
                            className="w-full rounded-xl border border-zinc-300 bg-zinc-100 py-2.5 pl-8 pr-3 outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[0.98] hover:bg-emerald-600 active:scale-95"
              >
                Save Business Details
              </button>

            </div>

          </div>
        </form>
      </div>
    </>
  )
}

export default Business