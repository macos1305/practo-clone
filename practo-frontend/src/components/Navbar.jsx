import { useAuth } from "../context/AuthContext";
import { logout } from "../api/authApi";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Practo Clone
      </h1>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 bg-green-500 rounded"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
