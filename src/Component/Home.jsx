import { useState } from 'react'
import { SiDarkreader } from "react-icons/si";
import { Link } from 'react-router-dom';

function Home() {
  const [toggle, setToggle] = useState(false)
  return (
    <>
      <div className={`relative w-full h-screen overflow-hidden transition-colors duration-500 ${toggle ? "bg-black text-white" : "bg-linear-to-br from-zinc-100 via-zinc-100 to-zinc-300 text-black"}`}>

        <div className='absolute inset-0 overflow-hidden pointer-events-none'>

          <div className={`absolute w-full h-px animate-scan ${toggle ? "bg-emerald-500/60" : "bg-emerald-500/60"}`}
            style={{ boxShadow: toggle ? '0 0 20px 1px #10b981' : '0 0 15px 1px #10b98180' }} />
        </div>

        {/* Content layer */}
        <div className='relative z-10'>
          <div className='flex justify-between items-center px-6 py-4'>
            <h1 className='group font-semibold tracking-tight text-xl cursor-pointer flex'>
              <span className='inline-block transition-transform duration-300 group-hover:-translate-y-1'>
                Book
              </span>
              <span className='inline-block transition-transform duration-300 group-hover:translate-y-1 text-emerald-500 font-bold'>
                Nest
              </span>
            </h1>
            <button
              className={`group p-2 rounded-xl cursor-pointer border transition-all duration-300 hover:scale-105 ${toggle ? "border-zinc-700 hover:bg-zinc-900" : "border-zinc-200 bg-white"}`}
              onClick={() => setToggle(!toggle)}>
              <SiDarkreader size={22} className='group-hover:scale-110 duration-300 group-hover:text-emerald-500' />
            </button>
          </div>

          <div className='p-3'>
            <div className="flex flex-col items-center text-center pt-20">
              <h1
                className="animate-heroPop text-7xl font-bold tracking-wider"
                style={{ fontFamily: "Anton, sans-serif" }}
              >
                Time Matters. Don't{" "}
                <span className="bg-linear-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                  Wait in Line
                </span>
              </h1>

              <p className="animate-fadeUp mt-6 max-w-3xl text-lg leading-8 text-zinc-600" style={{ animationDelay: '400ms' }}>
                Skip the long queues and save valuable time. BookNest lets you discover
                nearby businesses, check live wait times, book your spot in advance, and
                get notified when it's your turn—all from your phone.
              </p>
            </div>

            <div className='flex justify-center gap-15 font-bold mt-15'>
              <Link to='/auth' state={{ role: "Business" }}>
              <button className="animate-slideInLeft group relative overflow-hidden rounded-2xl px-7 py-3 border sm:border-none font-semibold transition-all duration-300 cursor-pointer"
                style={{ animationDelay: '600ms' }}>
                <span className="relative z-10">For Businesses</span>
                <span className="absolute left-0 top-0 border h-full w-2 rounded-2xl bg-emerald-500 transition-all duration-600 group-hover:w-full"></span>
              </button>
              </Link>

              <Link to='/auth' state={{ role: "Customer" }}>
              <button className="animate-slideInRight group relative overflow-hidden rounded-2xl border sm:border-none px-7 py-3 font-semibold transition-all duration-300 cursor-pointer"
                style={{ animationDelay: '700ms' }}>
                <span className="relative z-10">For Customers</span>
                <span className="absolute right-0 top-0 border h-full w-2 rounded-2xl bg-emerald-500 transition-all duration-600 group-hover:w-full"></span>
              </button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}

export default Home
