import { useState, useEffect } from "react";
import { getDoctorById, getDoctorSlots } from "../api/doctorApi";
import { bookAppointment, rescheduleAppointment } from "../api/appointmentApi";
import toast from "react-hot-toast";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { generateReceipt } from "../utils/generateReceipt";

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

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [showPayment, setShowPayment] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch doctor + slots
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

  // Auto redirect after success animation
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  // Slot click → open payment modal
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowPayment(true);
  };

  // Payment + booking logic
  const handlePayment = async () => {
    try {
      if (appointmentId) {
        await rescheduleAppointment(appointmentId, selectedSlot.id);
      } else {
        await bookAppointment({
          doctorId: id,
          slotId: selectedSlot.id,
        });
      }

      // Update slot UI instantly
      setSlots((prev) =>
        prev.map((s) =>
          s.id === selectedSlot.id
            ? {
                ...s,
                status: "BOOKED",
              }
            : s,
        ),
      );

      // Close payment modal
      setShowPayment(false);

      // Show success animation
      setShowSuccess(true);

      // Clear selected slot
      setSelectedSlot(null);
    } catch (error) {
      console.error(error);
      toast.error("Payment/booking failed");
    }
  };

  // Generate next 7 days
  const next7Days = [...Array(7)].map((_, index) => {
    const date = new Date();

    date.setDate(date.getDate() + index);

    return {
      label: date.toLocaleDateString([], {
        weekday: "short",
        day: "numeric",
      }),

      value: date.toISOString().split("T")[0],
    };
  });

  // Filter slots by selected day
  const visibleSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.startTime).toISOString().split("T")[0];

    return slotDate === selectedDate;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Doctor Info */}
      {doctor && (
        <div className="mb-6 border rounded-lg p-4 shadow">
          <h2 className="text-2xl font-bold">{doctor.name}</h2>

          <p className="text-gray-600">{doctor.specialization}</p>

          <p className="text-gray-600">Experience: {doctor.experience} years</p>
        </div>
      )}

      {/* Day Tabs */}
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

      {/* Booking Mode Text */}
      {appointmentId ? (
        <p className="text-blue-600 mb-4 font-semibold">
          Select a new slot to reschedule appointment
        </p>
      ) : (
        <p className="mb-4">Select a slot to book appointment</p>
      )}

      {/* Slots */}
      <h3 className="text-xl font-semibold mb-3">Available Slots</h3>

      {visibleSlots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleSlots.map((slot) => {
            const isBooked = slot.status === "BOOKED";

            return (
              <button
                key={slot.id}
                disabled={isBooked}
                onClick={() => !isBooked && handleSlotClick(slot)}
                className={`p-3 rounded border transition ${
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
      <button
        onClick={() =>
          generateReceipt({
            patientName: "Current User",
            doctorName: appt.doctorName,
            appointmentTime: appt.startTime,
            appointmentId: appt.id,
            amount: 500,
            status: appt.status,
          })
        }
        className="px-3 py-1 bg-purple-500 text-white rounded"
      >
        Download Receipt
      </button>

      {/* Payment Modal */}
      {showPayment && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md ">
            <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>

            <p className="mb-2">Doctor: {doctor.name}</p>

            <p className="mb-2">Consultation Fee: ₹500</p>

            <p className="mb-4">
              Slot Time:{" "}
              {new Date(selectedSlot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handlePayment}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Pay & Confirm
              </button>

              <button
                onClick={() => {
                  setShowPayment(false);
                  setSelectedSlot(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center animate-bounce">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl mb-4">
              ✓
            </div>

            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Booking Confirmed!
            </h2>

            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorProfile;
