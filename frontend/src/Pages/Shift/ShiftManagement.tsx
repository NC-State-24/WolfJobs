import { useState, useEffect } from "react";
import { useUserStore } from "../../store/UserStore";
import axios from "axios";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);

  const role = useUserStore((state) => state.role);
  const userId = useUserStore((state) => state.id);

  const fetchAllShifts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users/allshifts");
      setShifts(res.data);
    } catch (error) {
      console.error("Error fetching all shifts:", error);
      throw error;
    }
  };
  const fetchMyShifts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/users/myshifts/${userId}`
      );
      setShifts(res.data);
    } catch (error) {
      console.error("Error fetching my shifts:", error);
      throw error;
    }
  };
  const getShifts = async () => {
    try {
      if (role === "Applicant") {
        fetchMyShifts();
      } else if (role === "Manager") {
        fetchAllShifts();
      }
    } catch (error) {
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    getShifts();
  }, [role, userId]);
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {role === "Manager" ? "All Shifts" : "My Shifts"}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="shifts table">
          <TableHead>
            <TableRow>
              <TableCell>Applicant ID</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell align="right">Duration (hours)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts && shifts.length > 0 ? (
              shifts.map((shift: Shift) => (
                <TableRow key={shift._id} hover>
                  <TableCell>{shift.applicantId}</TableCell>
                  <TableCell>
                    {format(new Date(shift.checkIn), "PPp")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(shift.checkOut), "PPp")}
                  </TableCell>
                  <TableCell align="right">
                    {shift.duration.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No shifts available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ShiftManagement;
