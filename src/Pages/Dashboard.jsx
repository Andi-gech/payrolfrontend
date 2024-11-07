import { FaGear } from "react-icons/fa6";
import { AreaChart, Area, XAxis, Tooltip } from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import Settings from "../Popups/Settings";
import { useState } from "react";
import UseFetchDepartments from "../hooks/UseFetchDepartments";
import UseFetchPayroll from "../hooks/UseFetchPayroll";
import LoadingPopup from "../Popups/LoadingPopup";
import ErrorPopup from "../Popups/ErrorPopup";
import { ThemeProvider, createTheme } from "@mui/material/styles";
export default function Home() {
  const [settingson, setsetting] = useState();
  const {
    data,
    isLoading: isDepartmentLoading,
    isError: isErrorDepartment,
  } = UseFetchDepartments();
  const {
    data: payrolls,
    isLoading: isPayrollLoading,
    isError: isErrorPayroll,
  } = UseFetchPayroll(2024, 10);
  const date = new Date();

  const rows = payrolls?.data?.map((payroll) => ({
    id: payroll.id,
    employeeName: payroll.employeeFirstName,
    payrollDate: payroll.month + "-" + payroll.year,
    amount: payroll.netPay > 0 ? payroll.netPay : 0,
    status: payroll.paymentStatus,
  }));

  const columns = [
    { field: "employeeName", headerName: "Employee Name", width: 200 },
    { field: "payrollDate", headerName: "Payroll Month", width: 150 },
    { field: "amount", headerName: "Amount", width: 120 },
    { field: "status", headerName: "Status", width: 100 },
  ];

  return (
    <div className="w-full relative ml-[15%]   bg-white  dark:bg-zinc-800 flex flex-col px-2 ">
      {settingson && (
        <Settings
          onClose={() => {
            setsetting(false);
          }}
        />
      )}
      {(isPayrollLoading || isDepartmentLoading) && <LoadingPopup />}
      {false && <ErrorPopup />}
      <div className="w-full h-[50px]  rounded-md flex flex-row items-center justify-between px-4">
        <p className="text-[24px] text-gray-800 dark:text-white font-bold">
          Payroll Dashboard
        </p>
        <div className="flex flex-row ">
          <div
            onClick={() => setsetting(true)}
            className="w-[40px] h-[40px] mx-2 bg-white dark:bg-zinc-800 shadow-sm shadow-zinc-300 rounded-md flex items-center justify-center"
          >
            <FaGear className=" dark:text-white" />
          </div>
          <Button variant="contained" color="primary">
            CREATE NEW Department
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-row  flex-wrap overflow-hidden  mt-4 rounded-md">
        <div className="w-full flex flex-row flex-wrap overflow-hidden mt-4 rounded-md">
          <div className="w-[650px] flex items-center justify-center flex-shrink-0 bg-white dark:bg-zinc-900 border-[1px] border-gray-200 dark:border-gray-700 h-[250px] mr-5 rounded-md">
            <AreaChart
              width={600}
              height={240}
              data={data?.data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4caf50" stopOpacity={0.6} />{" "}
                  {/* Green shade */}
                  <stop
                    offset="99%"
                    stopColor="#4caf50"
                    stopOpacity={0.2}
                  />{" "}
                  {/* Lighter green shade */}
                </linearGradient>
              </defs>
              <XAxis dataKey="department.name" tick={{ fontSize: 12 }} />{" "}
              {/* Smaller text size */}
              <Tooltip />
              <Area
                type="monotone"
                dataKey="employeeCount"
                stroke="#4caf50"
                fillOpacity={0.2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </div>

          <div className="w-[382px] flex-shrink-0 bg-yellow-50 dark:bg-zinc-800 flex flex-row items-center justify-center rounded-md h-[250px] border-[1px] border-gray-200 dark:border-gray-700">
            <div className="w-[150px] rounded-md h-[200px] bg-zinc-900 flex flex-col items-center justify-center">
              <p className="text-[20px] text-white font-bold">
                {date.toLocaleString("en-US", { month: "long" })}
              </p>
              <p className="text-[90px] text-white font-bold">
                {date.toLocaleString("en-US", { day: "numeric" })}
              </p>
            </div>
            <div className="ml-5 flex flex-col justify-center items-center ">
              <p className="text-[17px] text-zinc-900 font-bold">Date</p>
              <p className="text-[17px] text-zinc-400 font-bold">
                {date.toDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="w-[650px] border-[1px] border-gray-200 dark:border-gray-900 flex-shrink-0  mr-5  mt-5 h-[400px] rounded-[10px]">
          <div className="w-full h-[50px] flex items-center mx-2 ">
            <p className="text-[18px] text-gray-800 dark:text-white font-bold">
              Transaction History
            </p>
          </div>
          <DataGrid
            disableRowSelectionOnClick
            rows={rows}
            columns={columns}
            pageSize={5}
          ></DataGrid>
        </div>
        <div className="w-[35%] flex-shrink-0 bg-white dark:bg-zinc-900 border-[1px] border-gray-200  dark:border-gray-800  p-2  mt-5 h-[450px] rounded-md">
          <div className="w-full h-[50px] bg-white dark:bg-zinc-900 flex flex-row items-center justify-between ">
            <div>
              <p className="font-bold text-black dark:text-white">
                Payroll Summary
              </p>
              <p className="text-gray-500 dark:text-white">
                From 1-31 March,2022
              </p>
            </div>
            <p className=" font-bold text-[14px] text-blue-500">View Report</p>
          </div>
          <div className="h-[60px] flex flex-row mt-5">
            <div className="flex flex-row mx-3">
              <div className="w-[4px] bg-zinc-900"></div>
              <div className="flex flex-col items-center justify-between ">
                <p className="text-[17px]  text-gray-600 mx-3">Pending</p>
                <p className="text-[24px] font-bold">
                  {
                    payrolls?.data.filter((p) => p.paymentStatus === "PENDING")
                      .length
                  }
                </p>
              </div>
            </div>
            <div className="flex flex-row mx-3">
              <div className="w-[4px] bg-blue-900"></div>
              <div className="flex flex-col mx-2 items-center justify-between ">
                <p className="text-[17px]  text-gray-600 mx-3">Paid</p>
                <p className="text-[24px] font-bold">
                  {
                    payrolls?.data.filter((p) => p.paymentStatus === "PAID")
                      .length
                  }
                </p>
              </div>
            </div>
            <div className="flex flex-row mx-3">
              <div className="w-[4px] bg-blue-100"></div>
              <div className="flex flex-col mx-2 items-center justify-between ">
                <p className="text-[17px]  text-gray-600 mx-3">Pending</p>
                <p className="text-[24px] font-bold">
                  {
                    payrolls?.data.filter((p) => p.paymentStatus === "FAILED")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 1,
                    value:
                      payrolls?.data.filter(
                        (p) => p.paymentStatus === "PENDING"
                      ).length || 0, // Count of PENDING
                    color: "blue",
                  },
                  {
                    id: 2,
                    value:
                      payrolls?.data.filter((p) => p.paymentStatus === "PAID")
                        .length || 0, // Count of PAID
                    color: "green",
                  },
                  {
                    id: 3,
                    value:
                      payrolls?.data.filter((p) => p.paymentStatus === "FAILED")
                        .length || 0, // Count of FAILED
                    color: "red",
                  },
                ],
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,

                cx: 150,
                cy: 150,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
