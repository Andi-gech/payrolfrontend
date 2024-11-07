import { useLocation } from "react-router-dom";
import Bottons from "./Buttons";
import { FcReading } from "react-icons/fc";
export default function Header() {
  const location = useLocation();

  // Check if the current route is the login page
  if (location.pathname === "/login") {
    return null;
  }

  return (
    <div className="w-[16%]  h-full shadow-zinc-300 shadow-sm fixed bg-white dark:bg-zinc-900 z-30 flex flex-col shadow-sm stroke-zinc-400">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-[54px] h-[54px] bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
          <FcReading className="text-zinc-900 text-3xl" />
        </div>
        <div className="text-zinc-900 dark:text-white font-bold text-lg mt-2">
          User
        </div>
        <p className="text-[11px] text-blue-600">Admin</p>
      </div>
      <div className="w-full flex flex-col mt-[30px]">
        <Bottons name="Dashboard" route={"/"} />
        <Bottons name="Department" route={"/departments"} />
        <Bottons name="Employee Service" route={"/Employee"} />
        <Bottons name="Attendance Records" route={"/Record"} />
        <Bottons name="Reports" route={"/Report"} />
      </div>
    </div>
  );
}
