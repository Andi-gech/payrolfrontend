/* eslint-disable react/prop-types */

import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Buttons({ name, route }) {
  const [active, setActive] = useState(false);
  const location = useLocation(); // Use useLocation hook to track the current path

  useEffect(() => {
    setActive(route === location.pathname); // Update active state based on the route
  }, [location.pathname, route]);
  return (
    <Link to={route}>
      <div
        className={`shadow-sm my-1 ${
          active ? " text-orange-500" : "#3f3f46 dark:text-white"
        }  shadow-zinc-50 dark:shadow-zinc-700 h-[40px] flex items-center  pl-[30px]`}
      >
        {name}
      </div>
    </Link>
  );
}
