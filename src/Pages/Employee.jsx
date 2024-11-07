import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddEmployee from "../Popups/AddEmployee";
import { useState } from "react";
import UseFetchEmployee from "../hooks/UseFetchEmployee";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import LoadingPopup from "../Popups/LoadingPopup";
import ErrorPopup from "../Popups/ErrorPopup";

export default function Employee() {
  const [AddEmploye, setAddEmployee] = useState();
  const { data, isLoading, isError } = UseFetchEmployee();
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "FirstName", width: 100 },
    { field: "lastName", headerName: "LastName", width: 100 },
    { field: "departmentId", headerName: "Department", width: 200 },
    { field: "salary", headerName: "Job Salary", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 230,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`http://localhost:7777/api/v1/employee/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("Employee");
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="w-full ml-[15%] bg-white dark:bg-zinc-900 flex flex-row px-[20px] py-[20px] min-h-screen justify-between text-black dark:text-white">
      {AddEmploye && (
        <AddEmployee
          onClose={() => {
            setAddEmployee(false);
          }}
        />
      )}
      {isError && <ErrorPopup />}
      {(isLoading || mutation.isLoading) && <LoadingPopup />}
      <div className="flex flex-col w-[80%] h-full bg-white dark:bg-zinc-800 rounded-md justify-between">
        <div className="w-full h-[50px]">
          <p className="text-[24px] font-bold">Manage Employees</p>
        </div>

        <DataGrid
          rows={data?.data}
          columns={columns}
          pageSize={5}
          className="dark:bg-zinc-800"
        />
      </div>
      <div className="w-[19%]">
        <div className="w-full border-[1px] border-gray-200 bg-white dark:bg-zinc-800 h-[200px] rounded-md p-2 flex flex-col">
          <div className="w-full h-[40px] border-b-[1px] border-gray-700 flex bg-blue-600 items-center justify-center">
            <p className="text-[14px] text-white px-4 py-2">View Employee</p>
          </div>
          <div
            onClick={() => setAddEmployee(true)}
            className="w-full h-[40px] border-b-[1px] border-gray-700 flex items-center justify-center cursor-pointer"
          >
            <p className="text-[14px] text-zinc-900 dark:text-white px-4 py-2">
              Add New Employee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
