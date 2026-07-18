import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";

function Customer() {
  const navigate = useNavigate();

  useEffect(() => {
    getCustomerPage();
  }, [])

  const getCustomerPage = async () => {
    try {
      const res = await axios.get('http://localhost:5600//protected/customer',
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

  return (
    <div>
      <h1>Customer Page</h1>
    </div>
  )
}

export default Customer
