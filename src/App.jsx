import { Routes, Route } from "react-router-dom";
import Home from "./Component/Home"
import Auth from "./Authentication/Auth";
import Business from "./Component/Business";
import Customer from "./Component/Customer";
import { Toaster } from "react-hot-toast"
import Protected from "./Protected/Protected";
import BusinesProfile from "./Data/BusinesProfile";

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/business" element={<Protected> <Business /> </Protected>} />
        <Route path="/customer" element={<Protected>  <Customer /> </Protected>} />
        <Route path="/businesProfile" element={<BusinesProfile/>}/>
      </Routes>
    </>
  )
}

export default App
