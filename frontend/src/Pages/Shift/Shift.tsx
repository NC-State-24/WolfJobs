import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserStore } from "../../store/UserStore";
import { toast} from "react-toastify";

const Shift: React.FC = () => {
  const userId = useUserStore((state) => state.id);
  
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);


  useEffect(() => {
      checkShiftStatus();
    }
  , [userId]);


const checkShiftStatus = () => {
    
    axios.get(`http://localhost:8000/users/active/${userId}`)
      .then((res) => {
        setIsCheckedIn(res.data.isActive);
      })
      .catch((error) => {
        console.error('Error checking shift status:', error);
      });
  };
 

  const handleCheckInOut = async () => {
    const endpoint = isCheckedIn ? 'checkout' : 'checkin';
    const formData = new FormData();
    formData.append('id', userId);
  
    try {
     const response = await axios.post(
        `http://localhost:8000/users/${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 201) {
        toast.success("Action Check-in/out successfull.");
      }
      await checkShiftStatus();
    } catch (error) {
      console.error(error)
      console.error('Error during check-in/out:', error);
    }
  };


  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-1/2"></div>
        <button 
          onClick={handleCheckInOut}
          className={`
            text-sm font-semibold leading-6 
            px-4 py-2 rounded-md 
            transition-colors duration-300
            ${isCheckedIn 
              ? "bg-red-500 text-white hover:bg-red-600" 
              : "bg-green-500 text-white hover:bg-green-600"}
          `}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>
    </>
  );
};


export default Shift;