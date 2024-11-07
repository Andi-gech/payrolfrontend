import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchPayroll(year, month) {
  const Fetchqr = async () => {
    return await axios.get(
      `http://localhost:5252/api/v1/payroll/year/${year}/month/${month + 1}`
    );
  };

  return useQuery({
    queryKey: ["payrolls", year, month + 1], // Include departmentId in the query key
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
    enabled: !!(year && month), // Ensure query only runs when departmentId is valid
  });
}
