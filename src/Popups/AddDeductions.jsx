/* eslint-disable react/prop-types */
import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function AddDeductions({ onClose }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (deduction) => {
      return await axios.post(
        "http://localhost:9191/api/v1/org/deductions",
        deduction
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("deductions");
    },
  });
  return (
    <div className="w-full h-full overflow-hidden bg-white dark:bg-zinc-900 absolute top-0 z-10 shadow-lg p-4">
      <div className="flex items-center justify-between h-[50px]  px-4">
        <p className="text-[20px] font-bold m-0">Add Deductions</p>
        <p
          onClick={onClose}
          className="text-[20px] font-bold cursor-pointer m-0"
        >
          X
        </p>
      </div>

      <div className="p-4">
        <TextField
          label="Deduction Name"
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{
            marginBottom: 2,
          }}
        />
        {/* Deduction Amount Input */}
        <TextField
          label="Deduction Amount"
          variant="outlined"
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          sx={{
            marginBottom: 2,
          }}
        />
        {/* Add Deduction Button */}
        <Button
          variant="contained"
          color="primary"
          className="w-3/5 mt-4 mx-auto"
          onClick={() => {
            mutation.mutate({ name, percentage: amount });
            onClose();
          }}
        >
          Add Deduction
        </Button>
      </div>
    </div>
  );
}
