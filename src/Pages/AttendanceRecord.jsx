/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  Select,
  MenuItem,
  Button,
  Modal,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseFetchAttendance from "../hooks/UseFetchAttendance";
import UseFetchEmployee from "../hooks/UseFetchEmployee";
import LoadingPopup from "../Popups/LoadingPopup";
import ErrorPopup from "../Popups/ErrorPopup";
import SucessPopup from "../Popups/SucessPopup";

const createPayroll = async ({ year, month }) => {
  const { data } = await axios.post(
    `http://localhost:5252/api/v1/payroll/create-all?year=${year}&month=${
      month + 1
    }`
  );
  return data;
};
const updateAttendance = async (attendanceDto) => {
  const { data } = await axios.post(
    `http://localhost:4343/api/v1/attendance/createOrUpdate`,
    attendanceDto
  );
  return data;
};
const AttendanceRecord = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const queryClient = useQueryClient();

  const [sucess, setSucess] = useState(false);
  const [error, setError] = useState(false);

  const { data: employeeData, isLoading: isEmployeeLoading } =
    UseFetchEmployee();

  const { data: attendanceData, isLoading: isAttendanceLoading } =
    UseFetchAttendance(selectedYear, selectedMonth);

  const rows = useMemo(() => {
    if (!attendanceData || !employeeData) return [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const attendanceMap = {};
    attendanceData?.data?.forEach((record) => {
      const dayIndex = new Date(record.date).getDate() - 1;
      if (!attendanceMap[record.employeeId]) {
        attendanceMap[record.employeeId] = Array(daysInMonth).fill("N");
      }
      attendanceMap[record.employeeId][dayIndex] = record.status[0];
    });
    return employeeData?.data?.map((employee) => ({
      id: employee.id,
      name: employee.firstName,
      department: employee.departmentId,
      attendance: attendanceMap[employee.id] || Array(daysInMonth).fill("N"),
    }));
  }, [attendanceData, employeeData, selectedMonth, selectedYear]);

  const mutation = useMutation(createPayroll, {
    onSuccess: () => {
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 2000);
      queryClient.invalidateQueries("attendance");
    },
    onError: (err) => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    },
  });
  const updateMutation = useMutation(updateAttendance, {
    onSuccess: () => {
      queryClient.invalidateQueries("attendance");
    },
    onError: (err) => {
      console.error("Error updating attendance:", err.response?.data?.message);
    },
  });

  const handleCellEdit = (params) => {
    const { id, field, value } = params;

    const updatedRow = rows.find((row) => row.id === id);
    console.log("updatedRow", params);

    

    const updatedAttendance = [...updatedRow.attendance];
    updatedAttendance[field] = value;

    const statusMapping = {
      N: "NOT PRESENT",
      P: "PRESENT",
      A: "ABSENT",
      L: "LATE",
    };

    const updatedAttendanceDto = {
      employeeId: updatedRow.id,
      departmentId: updatedRow.department,
      status: statusMapping[value] || value,
      date: new Date(selectedYear, selectedMonth, Number(field) + 2)
        .toISOString()
        .split("T")[0],
    };

    console.log("update", updatedAttendanceDto);

    updateMutation.mutate(updatedAttendanceDto);
  };

  const getCellStyle = (status) => {
    switch (status) {
      case "P":
        return "bg-green-200 text-green-800";
      case "L":
        return "bg-yellow-200 text-yellow-800";
      case "A":
        return "bg-red-200 text-red-800";
      default:
        return "";
    }
  };

  const columns = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return [
      {
        field: "name",
        headerName: "Name",
        width: 150,
        headerClassName: "sticky-header",
        cellClassName: "sticky-column",
      },
      { field: "department", headerName: "Department", width: 150 },
      ...Array.from({ length: daysInMonth }, (_, index) => ({
        field: index.toString(),
        headerName: `${index + 1}`,
        width: 40,
        renderCell: (params) => {
          const isSunday =
            new Date(selectedYear, selectedMonth, index + 1).getDay() === 0;
          const status = params.row.attendance[index];
          return (
            <Select
              value={status}
              onChange={(event) =>
                handleCellEdit({
                  id: params?.row?.id,
                  field: index,
                  value: event?.target?.value,
                })
              }
              fullWidth
              disabled={isSunday}
              className={`w-full ${getCellStyle(status)}`}
            >
              <MenuItem value="N">N</MenuItem>
              <MenuItem value="P">P</MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="L">L</MenuItem>
            </Select>
          );
        },
      })),
    ];
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleMonthChange = (event) => setSelectedMonth(event.target.value);

  const handleCalculatePayroll = () => {
    mutation.mutate({ year: selectedYear, month: selectedMonth });
  };

  return (
    <div className="h-screen w-full pl-[17%] bg-white dark:bg-zinc-900 overflow-x-auto overflow-hidden flex flex-col text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">
        Attendance Record For ({selectedMonth + 1} - {selectedYear})
      </h1>
      {(isAttendanceLoading || isEmployeeLoading) && <LoadingPopup />}
      {error && <ErrorPopup />}
      {sucess && <SucessPopup />}

      <div className="flex mb-4">
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          className="mr-4"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <MenuItem key={index} value={2023 + index}>
              {2023 + index}
            </MenuItem>
          ))}
        </Select>

        <Select value={selectedMonth} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, index) => (
            <MenuItem key={index} value={index}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div style={{ flex: 1, height: "400px" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={5}
          checkboxSelection
          className="data-grid"
        />
      </div>

      <div className="mb-[30px]">
        <Button
          variant="contained"
          onClick={handleCalculatePayroll}
          color="primary"
        >
          Calculate Payroll
        </Button>
      </div>
    </div>
  );
};

export default AttendanceRecord;
