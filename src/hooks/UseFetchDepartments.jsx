import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export default function UseFetchDepartments() {
  const authHeader = useAuthHeader();
  const Fetchqr = async () => {
    return await axios.get(
      `http://localhost:9999/api/v1/org/departments/departments-with-employee-count`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
  };

  return useQuery({
    queryKey: ["departments"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
