import { NavLink } from "react-router-dom";
import { FiHome, FiTool, FiBarChart2 } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-darkcard text-darktext min-h-screen p-6 shadow-xl">
      <h2 className="text-lg font-bold mb-8">Logo</h2>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/30 ${
              isActive ? "bg-primary/50" : ""
            }`
          }
        >
          <FiHome /> Dashboard
        </NavLink>

        <NavLink
          to="/service-records"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/30 ${
              isActive ? "bg-primary/50" : ""
            }`
          }
        >
          <FiTool /> Service Records
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
