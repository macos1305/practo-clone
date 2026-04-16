import { useState, useEffect } from "react";
import { getAppointments } from "../api/appointmentApi";
import { logout } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments();
                setAppointments(data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);
    const { setUser } = useAuth();
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

    if (loading) return <p>Loading...</p>;

    return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">My Appointments</h1>

      <button
     onClick={handleLogout}
     className="px-4 py-2 bg-red-500 text-white rounded"
     >
      Logout
     </button>
      </div>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li key={appt.id} className="border rounded-lg p-4 shadow">
                <h2 className="text-xl font-semibold">{appt.doctorName}</h2>

                <p className="text-gray-600">
                  Time: {new Date(appt.startTime).toLocaleString()}
                </p>

                <p>Status: {appt.status}</p>

                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    Cancel
                  </button>

                  <button
                    disabled={appt.status !== "SCHEDULED"}
                    onClick={() =>
                      navigate(
                        `/doctor/${appt.doctorId}?appointmentId=${appt.id}`,
                      )
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                  >
                    Reschedule
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
    
    
}

export default Dashboard;