import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchAttendance(year, month) {
  const Fetchqr = async () => {
    return await axios.get(
      `http://localhost:4343/api/v1/attendance/${year}/${month + 1}`
    );
  };

  return useQuery({
    queryKey: ["attendance", year, month + 1], // Include departmentId in the query key
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
    enabled: !!(year && month), // Ensure query only runs when departmentId is valid
  });
}