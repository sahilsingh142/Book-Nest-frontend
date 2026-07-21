import { useState, useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiTag } from 'react-icons/fi';
import { BiLogOutCircle } from "react-icons/bi";

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
    const [profileData, setProfileData] = useState(null);

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

    if (!profileData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-50 text-sm text-zinc-400">
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

            <div className="stagger relative z-10 mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-10">

                {/* Business header card */}
                <div className="panel rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
                    <span className="mb-3 inline-flex items-center gap-1.5 tracking-widest rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                        <FiTag size={12} />
                        {profileData.category}
                    </span>

                    <h2 className="text-3xl font-bold text-zinc-900 sm:text-3xl">
                        {profileData.businessName}
                    </h2>

                    <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:gap-6 font-medium justify-between">
                        <InfoRow icon={FiMapPin} text={[profileData.village, profileData.city].filter(Boolean).join(", ")} />
                        <InfoRow icon={FiPhone} text={profileData.number} />
                    </div>
                </div>

                <div className='mt-15'>
                    <p className="mb-4 text-sm font-medium text-zinc-700">Services & Pricing</p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {profileData.services?.map((service) => (
                            <ServiceCard key={service._id} name={service.name} price={service.price} />
                        ))}
                    </div>
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
        </div>
    );
}

export default BusinesOwn;