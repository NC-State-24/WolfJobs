import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import {
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserStore } from "../../store/UserStore";

type FormValues = {
  recruiterId: string;
  date: string;
  startTime: string;
  endTime: string;
};

type Slot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  applicantId?: string;
  recruiterId: string;
};

const Appointment = () => {
  const [applicantId, setApplicantId] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [managerSlots, setManagerSlots] = useState<Slot[]>([]);

  const role = useUserStore((state) => state.role);
  const managerId = useUserStore((state) => state.id);

  const { setValue, register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      recruiterId: managerId,
      date: "",
      startTime: "",
      endTime: "",
    },
  });
  const { errors } = formState;

  useEffect(() => {
    setValue("recruiterId", managerId);
    fetchAvailableSlots();
    if (role === "Applicant") {
      fetchBookedSlots(applicantId);
    }
    if (role === "Manager") {
      fetchManagerSlots(managerId);
    }
  }, [managerId, applicantId, role, setValue]);

  // Fetch available slots
  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/users/appointment/slots");
      await setAvailableSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      // toast.error("Failed to fetch available slots.");
    }
  };

  // Fetch booked slots for the applicant
  const fetchBookedSlots = async (applicantId: string) => {
    if (!applicantId) return;
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/users/appointment/appointments/${applicantId}`);
      setBookedSlots(response.data);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      // toast.error("Failed to fetch booked slots.");
    }
  };

  // Fetch all slots for the manager
  const fetchManagerSlots = async (managerId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/users/appointment/manager/${managerId}`);
      setManagerSlots(response.data);
    } catch (error) {
      console.error("Error fetching manager slots:", error);
      // toast.error("Failed to fetch manager slots.");
    }
  };

  // Submit handler for creating a slot
  const onCreateSlot = async (data: FormValues) => {
    try {
      await axios.post("http://localhost:8000/api/v1/users/appointment/slots", data);
      toast.success("Slot created successfully!");
      fetchAvailableSlots(); // Refresh slots
    } catch (error) {
      console.error("Error creating slot:", error);
      toast.error("Failed to create slot.");
    }
  };

  // Booking handler for applicants
  const onBookSlot = async (slotId: string, date: string, startTime: string, endTime: string) => {
    if (!applicantId) {
      toast.error("Applicant ID is required to book a slot.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/v1/users/appointment/bookslots", { slotId, applicantId, date, startTime, endTime });
      toast.success("Slot booked successfully!");
      fetchAvailableSlots(); // Refresh slots
      // fetchBookedSlots(applicantId); // Refresh booked slots
    } catch (error) {
      console.error("Error booking slot:", error);
      toast.error("Failed to book slot.");
    }
  };

  return (
    <div className="flex flex-row">
      {/* Sidebar with steps */}
      <div className="w-3/12 pt-10 border-r" style={{ height: "calc(100vh - 72px)" }}>
        <div className="text-2xl translate-x-10">Manage Appointments</div>
        <div className="flex flex-col items-start ml-10 mt-10">
          {role === "Manager" && (
            <div className="inline-flex items-center flex-row">
              <AiFillCheckCircle color="#1E1E1E" size="20px" />
              <span className="ml-2 text-xl text-[#1E1E1E]">Create Slots</span>
            </div>
          )}
          {role === "Applicant" && (
            <div className="inline-flex items-center flex-row">
              <AiFillCheckCircle color="#1E1E1E" size="20px" />
              <span className="ml-2 text-xl text-[#1E1E1E]">Book Slots</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-9/12 pt-10 pl-10" style={{ height: "calc(100vh - 72px)" }}>
        {role === "Manager" && (
          <>
            {/* Manager: Create Slots */}
            <div className="text-2xl translate-x-10">Create Slots</div>
            <form onSubmit={handleSubmit(onCreateSlot)} noValidate className="m-4 mx-10">
              <Stack spacing={2} width={600}>
                <TextField
                  label="Recruiter ID"
                  type="text"
                  {...register("recruiterId", { required: "Recruiter ID is required" })}
                  value={managerId || ""}
                  InputProps={{ readOnly: true }}
                  error={!!errors.recruiterId}
                  helperText={errors.recruiterId?.message}
                />
                <TextField
                  label="Date"
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
                <TextField
                  label="Start Time"
                  type="time"
                  {...register("startTime", { required: "Start time is required" })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                />
                <TextField
                  label="End Time"
                  type="time"
                  {...register("endTime", { required: "End time is required" })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
                />
                <Button type="submit" variant="outlined">Create Slot</Button>
              </Stack>
            </form>

            {/* Manager: View Slots */}
            <div className="text-2xl translate-x-10 mt-8">All Booked Slots</div>
            <div className="slot-list">
              {managerSlots.length === 0 ? (
                <p>No booked slots found for your created slots.</p>
              ) : (
                managerSlots.map((slot) => (
                  <div key={slot._id} className="slot-card">
                    <p><strong>Date:</strong> {slot.date}</p>
                    <p><strong>Time:</strong> {slot.startTime} - {slot.endTime}</p>
                    <p><strong>Applicant ID:</strong> {slot.applicantId || "Not Booked"}</p>
                    <hr></hr>
                    <br />
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {role === "Applicant" && (
          <>
            {/* Applicant: Book Slots */}
            <div className="text-2xl translate-x-10">Book Slots</div>
            <Stack spacing={2} width={600} className="m-4 mx-10">
              <TextField
                label="Applicant ID"
                type="text"
                value={applicantId}
                onChange={(e) => setApplicantId(e.target.value)}
                required
              />
              <div className="slot-list">
                {availableSlots.length === 0 ? (
                  <p>No available slots found.</p>
                ) : (
                  availableSlots.map((slot) => (
                    <div key={slot._id} className="slot-card">
                      <p><strong>Date:</strong> {slot.date}</p>
                      <p><strong>Time:</strong> {slot.startTime} - {slot.endTime}</p>
                      <Button onClick={() => onBookSlot(slot._id, slot.date, slot.startTime, slot.endTime)} variant="contained">Book Slot</Button>
                    </div>
                  ))
                )}
              </div>
            </Stack>
          </>
        )}
      </div>
    </div>
  );
};

export default Appointment;




// import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router";
// import { AiFillCheckCircle } from "react-icons/ai";
// import {
//   Button,
// //   FormControl,
// //   InputLabel,
// //   MenuItem,
// //   Select,
// //   SelectChangeEvent,
//   Stack,
//   TextField,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useUserStore } from "../../store/UserStore";

// type FormValues = {
//   recruiterId: string;
//   date: string;
//   startTime: string;
//   endTime: string;
// };

// type Slot = {
//   _id: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   isBooked: boolean;
// };

// const Appointment = () => {
// //   const navigate = useNavigate();

//   // State for form data
//   const [applicantId, setApplicantId] = useState<string>("");
//   const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
//   const role = useUserStore((state) => state.role);
//   const managerId = useUserStore((state) => state.id);
//   const { setValue } = useForm();
//   useEffect(() => {
//     setValue("recruiterId", managerId);
//   }, [managerId, setValue]);

//   // React Hook Form setup
//   const form = useForm<FormValues>({
//     defaultValues: {
//       recruiterId: managerId,
//       date: "",
//       startTime: "",
//       endTime: "",
//     },
//   });

//   const { register, handleSubmit, formState } = form;
//   const { errors } = formState;

//   // Fetch available slots
//   useEffect(() => {
//     fetchAvailableSlots();
//   }, []);

//   const fetchAvailableSlots = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/v1/users/appointment/slots");
//       setAvailableSlots(response.data);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       toast.error("Failed to fetch available slots.");
//     }
//   };

//   // Submit handler for creating a slot
//   const onCreateSlot = async (data: FormValues) => {
//     try {
//       await axios.post("http://localhost:8000/api/v1/users/appointment/slots", data);
//       toast.success("Slot created successfully!");
//       fetchAvailableSlots(); // Refresh slots
//     } catch (error) {
//       console.error("Error creating slot:", error);
//       toast.error("Failed to create slot.");
//     }
//   };

//   // Booking handler for applicants
//   const onBookSlot = async (slotId: string) => {
//     if (!applicantId) {
//       toast.error("Applicant ID is required to book a slot.");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:8000/api/v1/users/appointment/bookslots", { slotId, applicantId });
//       toast.success("Slot booked successfully!");
//       fetchAvailableSlots(); // Refresh slots
//     } catch (error) {
//       console.error("Error booking slot:", error);
//       toast.error("Failed to book slot.");
//     }
//   };

//   const fetchAppointments = async (applicantId: any) => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/v1/users/appointment/appointments/${applicantId}`);
//       console.log("Appointments:", response.data);
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//     }
//   };

//   const updateStatus = async (appointmentId: any, status: any) => {
//     try {
//       const response = await axios.put(`http://localhost:8000/api/v1/users/appointment/appointments/${appointmentId}`, { status });
//       console.log("Updated Appointment:", response.data);
//     } catch (error) {
//       console.error("Error updating appointment:", error);
//     }
//   };

//   return (
//     <div className="flex flex-row">
//       {/* Sidebar with steps */}
//       <div
//         className="w-3/12 pt-10 border-r"
//         style={{ height: "calc(100vh - 72px)" }}
//       >
//         <div className="text-2xl translate-x-10">Manage Appointments</div>
//         <div className="flex flex-col items-start ml-10 mt-10">
//           {role === "Manager" && (
//             <div className="inline-flex items-center flex-row">
//               <AiFillCheckCircle color="#1E1E1E" size="20px" />
//               <span className="ml-2 text-xl text-[#1E1E1E]">Create Slots</span>
//             </div>
//           )}
//           {role === "Applicant" && (
//             <div className="inline-flex items-center flex-row">
//               <AiFillCheckCircle color="#1E1E1E" size="20px" />
//               <span className="ml-2 text-xl text-[#1E1E1E]">Book Slot</span>
//             </div>
//           )}
//         </div>
//       </div>
  
//       {/* Main Content */}
//       <div
//         className="w-9/12 pt-10 pl-10"
//         style={{ height: "calc(100vh - 72px)" }}
//       >
//         {role === "Manager" && (
//           <>
//             {/* Manager: Create Slots */}
//             <div className="text-2xl translate-x-10">Create Slots</div>
//             <div className="flex flex-col">
//               <form
//                 onSubmit={handleSubmit(onCreateSlot)}
//                 noValidate
//                 className="m-4 mx-10"
//               >
//                 <Stack spacing={2} width={600}>
//                   <TextField
//                     label="Recruiter ID"
//                     type="text"
//                     {...register("recruiterId", {
//                       required: "Recruiter ID is required",
//                     })}
//                     value={managerId || ""}
//                     InputProps={{
//                       readOnly: true,
//                     }}
//                     error={!!errors.recruiterId}
//                     helperText={errors.recruiterId?.message}
//                     sx={{
//                       "& label": { paddingLeft: (theme) => theme.spacing(1) },
//                       "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
//                       "& fieldset": {
//                         paddingLeft: (theme) => theme.spacing(1.5),
//                         borderRadius: "10px",
//                       },
//                     }}
//                   />
//                   <TextField
//                     label="Date"
//                     type="date"
//                     {...register("date", {
//                       required: "Date is required",
//                     })}
//                     InputLabelProps={{ shrink: true }}
//                     error={!!errors.date}
//                     helperText={errors.date?.message}
//                   />
//                   <TextField
//                     label="Start Time"
//                     type="time"
//                     {...register("startTime", {
//                       required: "Start time is required",
//                     })}
//                     InputLabelProps={{ shrink: true }}
//                     error={!!errors.startTime}
//                     helperText={errors.startTime?.message}
//                   />
//                   <TextField
//                     label="End Time"
//                     type="time"
//                     {...register("endTime", {
//                       required: "End time is required",
//                     })}
//                     InputLabelProps={{ shrink: true }}
//                     error={!!errors.endTime}
//                     helperText={errors.endTime?.message}
//                   />
//                   <Button
//                     type="submit"
//                     variant="outlined"
//                     style={{
//                       color: "#FF5353",
//                       borderColor: "#FF5353",
//                       textTransform: "none",
//                       fontSize: "16px",
//                       minWidth: "200px",
//                     }}
//                   >
//                     Create Slot
//                   </Button>
//                 </Stack>
//               </form>
//             </div>
//           </>
//         )}
  
//         {role === "Applicant" && (
//           <>
//             {/* Applicant: Book Slots */}
//             <div className="text-2xl translate-x-10 mt-8">Book Slots</div>
//             <Stack spacing={2} width={600} className="m-4 mx-10">
//               <TextField
//                 label="Applicant ID"
//                 type="text"
//                 value={applicantId}
//                 onChange={(e) => setApplicantId(e.target.value)}
//                 required
//               />
//               <div className="slot-list">
//                 {availableSlots.length === 0 ? (
//                   <p>No available slots found.</p>
//                 ) : (
//                   availableSlots.map((slot) => (
//                     <div key={slot._id} className="slot-card">
//                       <p>
//                         <strong>Date:</strong> {slot.date}
//                       </p>
//                       <p>
//                         <strong>Time:</strong> {slot.startTime} - {slot.endTime}
//                       </p>
//                       <Button
//                         onClick={() => onBookSlot(slot._id)}
//                         variant="contained"
//                         color="primary"
//                       >
//                         Book Slot
//                       </Button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </Stack>
//           </>
//         )}
//       </div>
//     </div>
//   );  

//   // return (
//   //   <div className="flex flex-row">
//   //     {/* Sidebar with steps */}
//   //     <div
//   //       className="w-3/12 pt-10 border-r"
//   //       style={{ height: "calc(100vh - 72px)" }}
//   //     >
//   //       <div className="text-2xl translate-x-10">Manage Appointments</div>
//   //       <div className="flex flex-col items-start ml-10 mt-10">
//   //         <div className="inline-flex items-center flex-row">
//   //           <AiFillCheckCircle color="#1E1E1E" size="20px" />
//   //           <span className="ml-2 text-xl text-[#1E1E1E]">Create Slots</span>
//   //         </div>
//   //         <div className="inline-flex items-center flex-row">
//   //           <AiFillCheckCircle color="#CBCBCB" size="20px" />
//   //           <span className="ml-2 text-xl text-[#CBCBCB]">Book Slot</span>
//   //         </div>
//   //         <div className="inline-flex items-center flex-row">
//   //           <AiFillCheckCircle color="#CBCBCB" size="20px" />
//   //           <span className="ml-2 text-xl text-[#CBCBCB]">Review</span>
//   //         </div>
//   //       </div>
//   //     </div>

//   //     {/* Main Content */}
//   //     <div
//   //       className="w-9/12 pt-10 pl-10"
//   //       style={{ height: "calc(100vh - 72px)" }}
//   //     >
//   //       <div className="text-2xl translate-x-10">Create Slots</div>
//   //       <div className="flex flex-col">
//   //         {/* Form for Recruiter to Create Slots */}
//   //         <form
//   //           onSubmit={handleSubmit(onCreateSlot)}
//   //           noValidate
//   //           className="m-4 mx-10"
//   //         >
//   //           <Stack spacing={2} width={600}>
//   //             <TextField
//   //               label="Recruiter ID"
//   //               type="text"
//   //               {...register("recruiterId", {
//   //                 required: "Recruiter ID is required",
//   //               })}
//   //               error={!!errors.recruiterId}
//   //               helperText={errors.recruiterId?.message}
//   //               sx={{
//   //                 "& label": { paddingLeft: (theme) => theme.spacing(1) },
//   //                 "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
//   //                 "& fieldset": {
//   //                   paddingLeft: (theme) => theme.spacing(1.5),
//   //                   borderRadius: "10px",
//   //                 },
//   //               }}
//   //             />
//   //             <TextField
//   //               label="Date"
//   //               type="date"
//   //               {...register("date", {
//   //                 required: "Date is required",
//   //               })}
//   //               InputLabelProps={{ shrink: true }}
//   //               error={!!errors.date}
//   //               helperText={errors.date?.message}
//   //             />
//   //             <TextField
//   //               label="Start Time"
//   //               type="time"
//   //               {...register("startTime", {
//   //                 required: "Start time is required",
//   //               })}
//   //               InputLabelProps={{ shrink: true }}
//   //               error={!!errors.startTime}
//   //               helperText={errors.startTime?.message}
//   //             />
//   //             <TextField
//   //               label="End Time"
//   //               type="time"
//   //               {...register("endTime", {
//   //                 required: "End time is required",
//   //               })}
//   //               InputLabelProps={{ shrink: true }}
//   //               error={!!errors.endTime}
//   //               helperText={errors.endTime?.message}
//   //             />
//   //             <Button
//   //               type="submit"
//   //               variant="outlined"
//   //               style={{
//   //                 color: "#FF5353",
//   //                 borderColor: "#FF5353",
//   //                 textTransform: "none",
//   //                 fontSize: "16px",
//   //                 minWidth: "200px",
//   //               }}
//   //             >
//   //               Create Slot
//   //             </Button>
//   //           </Stack>
//   //         </form>

//   //         {/* Applicant Slot Booking */}
//   //         <div className="text-2xl translate-x-10 mt-8">Book Slots</div>
//   //         <Stack spacing={2} width={600} className="m-4 mx-10">
//   //           <TextField
//   //             label="Applicant ID"
//   //             type="text"
//   //             value={applicantId}
//   //             onChange={(e) => setApplicantId(e.target.value)}
//   //             required
//   //           />
//   //           <div className="slot-list">
//   //             {availableSlots.length === 0 ? (
//   //               <p>No available slots found.</p>
//   //             ) : (
//   //               availableSlots.map((slot) => (
//   //                 <div key={slot._id} className="slot-card">
//   //                   <p>
//   //                     <strong>Date:</strong> {slot.date}
//   //                   </p>
//   //                   <p>
//   //                     <strong>Time:</strong> {slot.startTime} - {slot.endTime}
//   //                   </p>
//   //                   <Button
//   //                     onClick={() => onBookSlot(slot._id)}
//   //                     variant="contained"
//   //                     color="primary"
//   //                   >
//   //                     Book Slot
//   //                   </Button>
//   //                 </div>
//   //               ))
//   //             )}
//   //           </div>
//   //         </Stack>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
// };

// export default Appointment;
