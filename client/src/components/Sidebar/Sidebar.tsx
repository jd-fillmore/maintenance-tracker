import { NavLink } from "react-router-dom";
import { FiHome, FiTool, FiBarChart2 } from "react-icons/fi";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-darkcard text-darktext min-h-screen p-6 shadow-xl">
      <img className="pb-6" src={logo} alt="logo" />

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
