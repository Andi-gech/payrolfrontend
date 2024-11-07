import { useState, useMemo } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UseFetchPayroll from "../hooks/UseFetchPayroll";
import LoadingPopup from "../Popups/LoadingPopup";
import ErrorPopup from "../Popups/ErrorPopup";
import SucessPopup from "../Popups/SucessPopup";

const deletePayrolls = async ({ year, month }) => {
  await axios.delete(
    `http://localhost:5252/api/v1/payroll/year/${year}/month/${month + 1}`
  );
};

const updatePayrollStatus = async ({ id, status }) => {
  await axios.patch(`http://localhost:5252/api/v1/payroll/${id}`, {
    paymentStatus: status,
  });
};

const PayrollRecord = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [sucess, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: payrollData,
    isLoading,
    isError,
  } = UseFetchPayroll(selectedYear, selectedMonth);

  const rows = useMemo(() => {
    if (!payrollData) return [];
    return payrollData.data.map((record) => ({
      id: record.id,
      employeeId: record.employeeId,
      name: record.employeeFirstName,
      salary: record.baseSalary,
      pensionDeduction: record.pensionDeduction,
      taxDeduction: record.taxDeduction,
      overtimeHours: record.overtimeHours,
      overtimePay: record.overtimePay,
      bonuses: record.bonuses,
      totalDeductions: record.totalDeductions,
      grossPay: record.grossPay,
      netPay: record.netPay > 0 ? record.netPay : 0,
      status: record.paymentStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      absentDeduction: record.absentDeduction,
      deductionDetails: record.deductionDetails,
    }));
  }, [payrollData]);

  const deleteMutation = useMutation(deletePayrolls, {
    onSuccess: () => {
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 2000);
      queryClient.invalidateQueries(["payroll", selectedYear, selectedMonth]);
    },
    onError: () => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    },
  });

  const updateMutation = useMutation(updatePayrollStatus, {
    onSuccess: () => {
      setPayrollStatus("Payroll status updated successfully.");
      queryClient.invalidateQueries(["payroll", selectedYear, selectedMonth]);
    },
    onError: () => {
      setPayrollStatus("Failed to update payroll status. Please try again.");
    },
  });

  const handleDeletePayroll = () => {
    deleteMutation.mutate({ year: selectedYear, month: selectedMonth });
  };

  const handleStatusChange = (id, status) => {
    updateMutation.mutate({ id, status });
  };

  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleMonthChange = (event) => setSelectedMonth(event.target.value);

  return (
    <div className="h-screen w-full pl-[17%] bg-white dark:bg-zinc-900 overflow-x-auto overflow-hidden flex flex-col">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Payroll Record For ({selectedMonth + 1} - {selectedYear})
      </h1>
      {(isLoading || deleteMutation.isLoading || updateMutation.isLoading) && (
        <LoadingPopup />
      )}
      {isError || (error && <ErrorPopup />)}
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
          columns={[
            { field: "name", headerName: "Name", width: 150 },
            { field: "salary", headerName: "Salary", width: 150 },
            { field: "bonuses", headerName: "Bonuses", width: 150 },
            { field: "grossPay", headerName: "Gross Pay", width: 150 },
            {
              field: "pensionDeduction",
              headerName: "Pension Deduction",
              width: 150,
            },
            { field: "taxDeduction", headerName: "Tax Deduction", width: 150 },
            {
              field: "absentDeduction",
              headerName: "Absent Deduction",
              width: 150,
            },
            {
              field: "totalDeductions",
              headerName: "Total Deductions",
              width: 150,
            },
            { field: "netPay", headerName: "Net Pay", width: 150 },
            {
              field: "status",
              headerName: "Status",
              width: 250,
              renderCell: (params) => {
                return (
                  <Select
                    value={params.row.status}
                    onChange={(event) => {
                      console.log(
                        params.row.id,
                        event.target.value,
                        params.row.status
                      );
                      handleStatusChange(params.row.id, event.target.value);
                    }}
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                  </Select>
                );
              },
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={5}
          checkboxSelection
          className="data-grid"
        />
      </div>
      <div className="mb-[30px]">
        <Button
          variant="contained"
          onClick={handleDeletePayroll}
          color="secondary"
        >
          Delete Payroll
        </Button>
      </div>
      =
    </div>
  );
};

export default PayrollRecord;
