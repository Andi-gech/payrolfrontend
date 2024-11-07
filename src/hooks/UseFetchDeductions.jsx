import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
export default function UseFetchDeductions() {
  const authHeader = useAuthHeader();
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:9191/api/v1/org/deductions`, {
      headers: {
        Authorization: authHeader(),
      },
    });
  };

  return useQuery({
    queryKey: ["deductions"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
