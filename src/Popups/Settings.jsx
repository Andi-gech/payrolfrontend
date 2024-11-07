/* eslint-disable react/prop-types */
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import AddDeductions from "./AddDeductions";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import UseFetchDeductions from "../hooks/UseFetchDeductions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useDarkSide from "../hooks/useDarkSide";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useNavigate } from "react-router-dom";

export default function Settings({ onClose }) {
  const [addDeduction, setAddDeduction] = useState(false);
  const { data } = UseFetchDeductions();
  const queryClient = useQueryClient();
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(colorTheme === "dark");
  const Navigate = useNavigate();

  const toggleDarkMode = (checked) => {
    setTheme(checked ? "dark" : "light"); // Properly setting the theme
    setDarkSide(checked);
    window.location.reload();
  };

  const mutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(
        `http://localhost:9999/api/v1/org/deductions/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("deductions");
    },
    mutationKey: ["deductions"],
  });

  const signOut = useSignOut();

  return (
    <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-zinc-900 relative h-[500px] overflow-hidden rounded-md shadow-md shadow-zinc-600 p-4 w-[900px] flex">
        <div className="w-[25%] h-full bg-blue-500 flex flex-col justify-start sticky top-0">
          <div className="flex items-center my-2 justify-center h-[50px] bg-blue-400 rounded-md px-3 text-white">
            <DarkModeSwitch
              checked={darkSide}
              onChange={toggleDarkMode}
              size={26}
            />
          </div>
          <div className="flex items-center my-2 justify-center h-[50px] bg-blue-400 rounded-md px-3 text-white">
            Organizations
          </div>

          <div
            onClick={() => {
              signOut();
              Navigate("/login");
            }}
            className="flex items-center justify-center h-[50px] bg-blue-400 rounded-md px-3 text-white cursor-pointer"
          >
            LogOut
          </div>
        </div>

        <div className="w-[75%] relative mb-[10px]  px-6 ">
          {addDeduction && (
            <AddDeductions onClose={() => setAddDeduction(false)} />
          )}

          <div className="h-[50px] w-full flex justify-between items-center mb-4">
            <p className="font-bold text-[25px] dark:text-white">
              Adjust Payroll Policy
            </p>
            <p
              onClick={onClose}
              className="cursor-pointer text-[25px] text-red-500"
            >
              X
            </p>
          </div>

          <div className="h-[50px] w-full flex justify-between items-center mb-4">
            <p className="font-bold text-[18px] dark:text-white">Deductions</p>
            <div
              onClick={() => setAddDeduction(true)}
              className="w-[30px] h-[30px] bg-white shadow-md flex items-center justify-center cursor-pointer"
            >
              <FaPlus className="text-[20px] text-blue-500" />
            </div>
          </div>

          <div className="w-full max-h-[150px] min-h-[20px] overflow-y-auto rounded-md p-2 flex flex-col space-y-2 mb-4">
            {data?.data?.length === 0 ? (
              <p className="text-zinc-600 dark:text-white">No deductions</p>
            ) : (
              data?.data.map((deduction) => (
                <div
                  key={deduction.id}
                  className="w-full bg-white dark:text-white dark:bg-zinc-900 shadow-sm rounded-md p-2 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex justify-between flex-row">
                    <p className="text-[16px] ">{deduction.name}</p>
                    <p
                      className="text-[16px] cursor-pointer"
                      onClick={() => {
                        mutation.mutate(deduction.id);
                      }}
                    >
                      X
                    </p>
                  </div>
                  <p className="text-zinc-900 text-[14px]">
                    {deduction.percentage}%
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="w-full">
            <p className="font-bold mb-2 dark:text-white">Organization Type</p>
            <FormControl fullWidth>
              <InputLabel>Organization Type</InputLabel>
              <Select
                label="Organization Type"
                variant="outlined"
                className="mb-4"
              >
                <MenuItem value={"private"}>Private</MenuItem>
                <MenuItem value={"public"}>Public</MenuItem>
                <MenuItem value={"military"}>Military</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Add More Fields */}
          <div className="w-full mb-4 space-y-4">
            <TextField
              label="Vision"
              variant="outlined"
              fullWidth
              className="mb-4"
            />
            <TextField
              label="Mission"
              variant="outlined"
              fullWidth
              className="mb-4"
            />
          </div>
          <Button variant="contained" color="primary" sx={{ marginBottom: 5 }}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
