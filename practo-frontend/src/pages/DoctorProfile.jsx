import { useState, useEffect } from "react";
import { getDoctorById, getDoctorSlots } from "../api/doctorApi";
import { bookAppointment, rescheduleAppointment } from "../api/appointmentApi";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorData = await getDoctorById(id);
        const slotsData = await getDoctorSlots(id);

        setDoctor(doctorData);
        setSlots(slotsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSlotClick = async (slot) => {
    try {
      if (appointmentId) {
        await rescheduleAppointment(appointmentId, slot.id);
        alert("Appointment rescheduled!");
        navigate("/dashboard");
      } else {
        await bookAppointment({
          doctorId: id,
          slotId: slot.id,
        });

        alert("Appointment booked!");
      }

      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, status: "BOOKED" } : s)),
      );
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const next7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return {
      label: date.toLocaleDateString([], {
        weekday: "short",
        day: "numeric",
      }),
      value: date.toISOString().split("T")[0],
    };
  });

  const visibleSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.startTime).toISOString().split("T")[0];

    return slotDate === selectedDate;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {doctor && (
        <div className="mb-6 border rounded-lg p-4 shadow">
          <h2 className="text-2xl font-bold">{doctor.name}</h2>

          <p>{doctor.specialization}</p>
          <p>Experience: {doctor.experience} years</p>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-3">Select Day</h3>

      <div className="flex gap-3 mb-6 overflow-x-auto">
        {next7Days.map((day) => (
          <button
            key={day.value}
            onClick={() => setSelectedDate(day.value)}
            className={`px-4 py-2 rounded border whitespace-nowrap ${
              selectedDate === day.value ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-3">Available Slots</h3>

      {visibleSlots.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {visibleSlots.map((slot) => {
            const isBooked = slot.status === "BOOKED";

            return (
              <button
                key={slot.id}
                disabled={isBooked}
                onClick={() => !isBooked && handleSlotClick(slot)}
                className={`p-3 rounded border ${
                  isBooked
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-100 hover:bg-green-200"
                }`}
              >
                {new Date(slot.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            );
          })}
        </div>
      ) : (
        <p>No slots available</p>
      )}
    </div>
  );
}

export default DoctorProfile;
