import { useState, useEffect } from "react";
import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../api/appointmentApi";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchAppointments = async () => {
     try {
       const data = await getDoctorAppointments();
       setAppointments(data);
     } catch (error) {
       console.error(error);
     } finally {
       setLoading(false);
     }
   };

   // first load immediately
   fetchAppointments();

   // auto refresh every 30 sec
   const intervalId = setInterval(() => {
     fetchAppointments();
   }, 30000);

   // cleanup on unmount
   return () => clearInterval(intervalId);
 }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: newStatus } : appt,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>

      {appointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{appt.patientName}</h2>

              <p>{new Date(appt.startTime).toLocaleString()}</p>

              <p>Status: {appt.status}</p>

              <div className="mt-2 flex gap-2">
                {appt.status === "SCHEDULED" && (
                  <button
                    onClick={() => handleStatusUpdate(appt.id, "IN_PROGRESS")}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Start Consultation
                  </button>
                )}

                {appt.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleStatusUpdate(appt.id, "COMPLETED")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Complete Consultation
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DoctorDashboard;
