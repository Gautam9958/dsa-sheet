import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="text-2xl">🧠</span>
          <span>DSA Sheet</span>
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden sm:block">
              👋 {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-700 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
