import { useAuth } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-darktext shadow-md">
      <div className="px-6 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide">Maintenance Tracker</h1>

        <div className="flex items-center gap-6">
          <div className="text-sm">
            <p className="font-semibold">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-black rounded-md font-semibold hover:opacity-90"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
