import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UseFetchEmployee() {
  const Fetchqr = async () => {
    return await axios.get(`http://localhost:7777/api/v1/employee`);
  };

  return useQuery({
    queryKey: ["Employee"],
    queryFn: Fetchqr,
    refetchOnWindowFocus: false,
  });
}
