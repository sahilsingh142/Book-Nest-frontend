import { useState, useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiTag, FiEdit2 } from 'react-icons/fi';
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

function InfoRow({ icon: Icon, text }) {
    if (!text) return null;
    return (
        <div className="flex items-center gap-3 text-sm text-zinc-600">
            <Icon size={16} className="text-emerald-500" />
            {text}
        </div>
    );
}


function ServiceCard({ name, price }) {
    return (
        <div className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
            <p className="text-sm text-zinc-500">{name}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
                ₹<span className="ml-1">{price}</span>
            </p>
        </div>
    );
}

function BusinesOwn() {
    const [showBusyForm, setShowBusyForm] = useState(false);
    const [status, setStatus] = useState("available");
    const [waitTime, setWaitTime] = useState(30);
    const [profileData, setProfileData] = useState(null);
    const [edit, setEdit] = useState(false);
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
    const [updatedStatus, setUpdatatedStatus] = useState({
        status: "available",
        waitTime: 0
    });
    const navigate = useNavigate();

    const increaseTime = () => {
        setWaitTime((prev) => Math.min(prev + 30, 300));
    };

    const decreaseTime = () => {
        setWaitTime((prev) => Math.max(prev - 30, 0));
    };


    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get("http://localhost:5600/fromData/businessProfile", {
                    withCredentials: true,
                });
                setProfileData(res.data);
            } catch (err) {
                console.log(err);
                toast.error("Profile Error");
            }
        };
        getProfile();
    }, []);

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
    const handleEditableData = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                "http://localhost:5600/fromData/updateBusiness",
                {
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

            setProfileData(res.data.data);
            setEdit(false);

            toast.success("Profile Updated Successfully");

        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        if (profileData) {
            setBusiName(profileData.businessName);
            setName(profileData.ownerName);
            setVillage(profileData.village);
            setCity(profileData.city);
            setNumber(profileData.number);

            const temp = {};

            profileData.services.forEach((service) => {
                temp[service.name] = service.price;
            });

            setPrices(temp);
        }
    }, [profileData]);

    const formatTime = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}m`;
    };

        const updateStatus = async (newStatus) => {
            try {
                await axios.put(
                    "http://localhost:5600/fromData/updateStatus",
                    {
                        status: newStatus,
                        waitTime: newStatus === "available" ? 0 : waitTime,
                    },
                    {
                        withCredentials: true,
                    }
                );

                await getUpdateData();

                setStatus(newStatus);
                setShowBusyForm(false);

            } catch (err) {
                console.log(err);
            }
        };

        const getUpdateData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5600/fromData/getStatusData",
                    {
                        withCredentials: true,
                    }
                );

                setUpdatatedStatus(res.data);

                setStatus(res.data.status);
                setWaitTime(res.data.waitTime);
            } catch (err) {
                console.log(err);
            }
        };

        useEffect(() => {
            getUpdateData();
        }, []);

        if (!profileData) {
            return (
                <div className="flex h-screen w-full items-center justify-center bg-zinc-50 text-sm font-medium text-zinc-500">
                    Loading profile...
                </div>
            );
        }

        return (
            <div className="relative min-h-screen w-full overflow-hidden bg-zinc-50">

                {/* Ambient background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -left-16 h-96 w-100 rounded-full bg-emerald-500/7 blur-4xl" />
                </div>

                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -bottom-30 -right-25 h-125 w-125 sm:h-160 sm:w-160 lg:h-200 lg:w-200 rounded-full bg-emerald-500/7 blur-4xl" />
                </div>

                {/* Navbar */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
                    <h1 className="group flex cursor-pointer text-xl font-semibold tracking-tight">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">Book</span>
                        <span className="inline-block font-bold text-emerald-500 transition-transform duration-300 group-hover:translate-y-1">Nest</span>
                    </h1>
                    <h1 className="font-bold tracking-wide text-zinc-800">{profileData.ownerName}</h1>
                </nav>

                <div className="stagger relative z-10 mx-auto max-w-5xl space-y-6 px-4 pb-5 pt-6">

                    {
                        !edit ? (<>
                            <div className="panel rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">

                                <div className='flex justify-between'>
                                    <span className="mb-3 inline-flex items-center gap-1.5 tracking-widest rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                                        <FiTag size={12} />
                                        {profileData.category}
                                    </span>

                                    <button onClick={() => setEdit(true)} className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-95 cursor-pointer">
                                        <FiEdit2 size={14} />
                                    </button>
                                </div>

                                <div className='flex justify-between'>
                                    <h2 className="text-3xl font-bold text-zinc-900 sm:text-3xl">
                                        {profileData.businessName}
                                    </h2>

                                    {
                                        status === "busy" ? (
                                            <div className='flex justify-center gap-3 pt-5'>
                                                <div className='flex justify-center items-center'>
                                                    <span className=' font-bold tracking-widest text-sm text-red-500'>Busy</span>
                                                </div>
                                                <h1 className='font-black font-mono tracking-wider border px-3 py-1 rounded-2xl bg-zinc-200'>{updatedStatus.waitTime}m</h1>
                                            </div>
                                        ) : (
                                            <span className='font-bold tracking-widest text-sm text-emerald-500 mt-5 rounded-fullmr-3'>Available</span>
                                        )
                                    }
                                </div>

                                <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:gap-6 font-medium justify-between">
                                    <InfoRow icon={FiMapPin} text={[profileData.village, profileData.city].filter(Boolean).join(", ")} />
                                    <InfoRow icon={FiPhone} text={profileData.number} />
                                </div>
                            </div>

                            <div className='mt-10'>
                                <p className="mb-4 text-sm font-medium text-zinc-700">Services & Pricing</p>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {profileData.services?.map((service) => (
                                        <ServiceCard key={service._id} name={service.name} price={service.price} />
                                    ))}
                                </div>
                            </div>
                        </>) : (
                            <div className="panel rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
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

                                <div>
                                    <p className="mt-8 text-sm font-medium text-zinc-700">Services & Pricing</p>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 pt-3">
                                        {profileData.services?.map((service) => (
                                            <div key={service._id} className="grid grid-cols-[180px_1fr] items-center gap-2">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">₹</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter Price"
                                                        name={service.name}
                                                        value={prices[service.name] ?? service.price}
                                                        onChange={handlePrice}
                                                        className="w-full rounded-xl border border-zinc-300 bg-zinc-100 py-2.5 pl-8 pr-3 outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex justify-center pt-5'>
                                        <button onClick={handleEditableData} className="rounded-2xl px-4 py-2  font-medium transition-all duration-300 hover:translate-x-0.5 bg-emerald-400 text-zinc-100 hover:shadow shadow-zinc-500 cursor-pointer">Save Change</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>

                <div className='flex justify-center pt-4 gap-5'>
                    {
                        showBusyForm ? (
                            <div className="mt-3 flex gap-5">

                                <div className='flex justify-center items-center font-mono font-black'>
                                    <label>Estimated Wait Time</label>
                                </div>

                                <div className="flex items-center rounded-full border border-zinc-300 bg-white shadow-md">

                                    <button onClick={decreaseTime} className="rounded-l-full px-5 py-3 text-2xl transition-all duration-300 hover:bg-zinc-100 hover:text-emerald-500 active:scale-90">
                                        −
                                    </button>

                                    <span className="min-w-28 text-center text-lg font-semibold">
                                        {formatTime(waitTime)}
                                    </span>

                                    <button onClick={increaseTime} className="rounded-r-full px-5 py-3 text-2xl transition-all duration-300 hover:bg-emerald-100 hover:text-emerald-500 active:scale-90">
                                        +
                                    </button>

                                </div>

                                <button onClick={() => updateStatus("busy")}
                                    className="rounded-full border cursor-pointer  bg-zinc-900 px-6 font-medium tracking-wider text-sm text-white transition-all duration-300 hover:translate-y-1 hover:scale-[0.98] hover:shadow-inner active:translate-y-0.75 active:scale-95 ">
                                    Update
                                </button>

                            </div>
                        ) : (
                            <div className='flex justify-between gap-5'>
                                <button onClick={() => {
                                 updateStatus("available");
                                    setShowBusyForm(false)
                                }}
                                    className={`rounded-full border cursor-pointer  bg-emerald-500 px-5 py-3 font-medium tracking-wider text-white transition-all duration-400 hover:translate-y-1 hover:scale-[0.98] hover:shadow-inner active:translate-y-0.75 active:scale-95 `}>
                                    Available
                                </button>

                                <button
                                    onClick={() => {
                                        setStatus("busy");
                                        setShowBusyForm(true);
                                    }}
                                    className={`rounded-full border cursor-pointer  bg-red-600 px-6 py-3 font-medium tracking-wider text-white transition-all duration-400 hover:translate-y-1 hover:scale-[0.98] hover:shadow-inner active:translate-y-0.75 active:scale-95 `}>
                                    Busy
                                </button>
                            </div>
                        )
                    }

                </div>

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
        );
    }

    export default BusinesOwn;