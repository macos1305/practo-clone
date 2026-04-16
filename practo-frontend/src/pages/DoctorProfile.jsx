import { useState, useEffect } from "react";
import { getDoctorById, getDoctorSlots } from "../api/doctorApi";
import { bookAppointment } from "../api/appointmentApi";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";


function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorData = await getDoctorById(id);
        const slotsData = await getDoctorSlots(id);

        setDoctor(doctorData);
        setSlots(slotsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  const handleSlotClick = async (slot) => {
    try {
      if (appointmentId) {
        await rescheduleAppointment(appointmentId, slot.id);
        alert("Appointment rescheduled successfully!");
        navigate("/dashboard");
      } else {
        await bookAppointment({
          doctorId: id,
          slotId: slot.id,
        });

        alert("Appointment booked successfully!");
      }

      setSlots((prevSlots) =>
        prevSlots.map((s) =>
          s.id === slot.id ? { ...s, status: "BOOKED" } : s,
        ),
      );
    } catch (error) {
      if (error.response?.status === 409) {
        alert("Slot already booked");
      } else {
        alert("Something went wrong");
      }
    }
  };
  return (
    <div>
      {doctor && (
        <div>
          <h2>{doctor.name}</h2>
          <p>Specialization: {doctor.specialization}</p>
          <p>Experience: {doctor.experience} years</p>
        </div>
      )}

      <div>
        <h3>Available Slots</h3>
        {appointmentId ? (
          <p className="text-blue-600 font-semibold">
            Select a new slot to reschedule appointment
          </p>
        ) : (
          <p>Select a slot to book appointment</p>
        )}

        {slots.length > 0 ? (
          <ul>
            {slots.map((slot) => {
              const isBooked = slot.status === "BOOKED";

              return (
                <li
                  onClick={!isBooked ? () => handleSlotClick(slot) : undefined}
                  key={slot.id}
                  className={`p-2 border rounded mb-2 ${
                    isBooked
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-100 cursor-pointer hover:bg-green-200"
                  }`}
                >
                  Start: {slot.startTime} | End: {slot.endTime} | Status:{" "}
                  {slot.status}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No slots available</p>
        )}
      </div>
    </div>
  );
}


export default DoctorProfile;
