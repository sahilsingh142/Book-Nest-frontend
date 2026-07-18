import { useState,useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';

function BusinesOwn() {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5600/fromData/businessProfile",
                    {
                        withCredentials: true,
                    }
                );
                console.log(res.data);
                setProfileData(res.data);
            } catch (err) {
                console.log(err);
                toast.error("Profile Error");
            }
        };
        getProfile();
    }, []);

    return (
        <>
            <div>
               
            </div>
        </>
    )
}

export default BusinesOwn
