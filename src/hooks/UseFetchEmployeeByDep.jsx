import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchEmployeeByDep(departmentId) {
  const Fetchqr = async () => {
    return await axios.get(
      `http://localhost:9191/api/v1/employee/bydep/${departmentId}`
    );
  };

  return useQuery({
    queryKey: ["departments", departmentId], // Include departmentId in the query key
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
    enabled: !!departmentId, // Ensure query only runs when departmentId is valid
  });
}
