/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

// API call to add a new department
const addDepartment = async (newDepartment) => {
  const response = await axios.post(
    "http://localhost:9999/api/v1/org/departments",
    newDepartment
  );
  return response.data;
};

export default function AddDepartment({ onClose }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [abbreviatedName, setAbbreviatedName] = useState("");
  const queryclient = useQueryClient();

  // Set up useMutation hook
  const mutation = useMutation(addDepartment, {
    onSuccess: () => {
      queryclient.invalidateQueries("departments");
      // Clear the form
    setName("");
    setLocation("");
    setAbbreviatedName("");

    // Close the modal
    onClose();
    },
    onError: (error) => {
      console.error("Error adding department:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare department data
    const newDepartment = {
      name,
      location,
      abbreviatedName,
    };

    // Trigger the mutation
    mutation.mutate(newDepartment);

    
  };

  return (
    <div className="absolute z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-md shadow-md shadow-zinc-600 p-4 w-96">
        <Typography variant="h6" className="mb-2">
          Add New Department
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Department Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            fullWidth
            label="Abbreviated Name"
            variant="outlined"
            margin="normal"
            value={abbreviatedName}
            onChange={(e) => setAbbreviatedName(e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Adding..." : "Add Department"}
            </Button>
          </div>
        </form>
        {mutation.isError && (
          <p style={{ color: "red" }}>
            Error adding department: {mutation.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
