async function createAppointment({ doctorId, patientId, slotId }) {
    return AppointmentModel.create({
        doctorId,
        patientId,
        slotId,
        status: "BOOKED"
    });
}