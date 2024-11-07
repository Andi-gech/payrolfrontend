/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import UseFetchDepartments from "../hooks/UseFetchDepartments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Dummy function to handle form submission (you can replace with your API call)
const addEmployee = async (employeeData) => {
  return axios.post("http://localhost:7777/api/v1/employee", employeeData);
};

export default function AddEmployee({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [hiredDate, setHiredDate] = useState("");
  const [terminationDate, setTerminationDate] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [salary, setSalary] = useState("");
  const [payFrequency, setPayFrequency] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const queryClient = useQueryClient();

  const { data } = UseFetchDepartments(); // Assuming it fetches departments from your API
  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries("employees");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      firstName,
      lastName,
      email,
      phone,
      address,
      dob,
      hiredDate,
      terminationDate,
      gender,
      status,
      salary,
      payFrequency,
      departmentId,
    });

    // Clear the form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setDob("");
    setHiredDate("");
    setTerminationDate("");
    setGender("");
    setStatus("");
    setSalary("");
    setPayFrequency("");
    setDepartmentId("");

    // Close the modal
    onClose();
  };

  return (
    <div className="absolute z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-md shadow-md shadow-zinc-600 p-4 w-[900px]">
        <Typography variant="h6" className="mb-2">
          Add New Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* First Row: First Name, Last Name, Email */}
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Second Row: Phone, Address, Date of Birth */}
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              fullWidth
              label="Phone"
              variant="outlined"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              fullWidth
              label="Date of Birth"
              variant="outlined"
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Third Row: Hire Date, Termination Date, Gender */}
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              fullWidth
              label="Hire Date"
              variant="outlined"
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={hiredDate}
              onChange={(e) => setHiredDate(e.target.value)}
            />
            <TextField
              fullWidth
              label="Termination Date"
              variant="outlined"
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={terminationDate}
              onChange={(e) => setTerminationDate(e.target.value)}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Fourth Row: Status, Salary, Pay Frequency */}
          <div style={{ display: "flex", gap: "10px" }}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="TERMINATED">Terminated</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Salary"
              variant="outlined"
              margin="normal"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Pay Frequency</InputLabel>
              <Select
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value)}
                label="Pay Frequency"
              >
                <MenuItem value="MONTHLY">Monthly</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                <MenuItem value="BIWEEKLY">Biweekly</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Fifth Row: Department */}
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              label="Department"
            >
              {data?.data?.map((dept) => (
                <MenuItem key={dept.department.id} value={dept.department.id}>
                  {dept.department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex justify-between mt-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Add Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
