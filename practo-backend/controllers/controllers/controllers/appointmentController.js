async function bookAppointment(req, res) {
    try{
        const { doctorId, slotId } = req.body;
        const patientId=req.user.id;

        const result = await appointmentService.bookAppointment({
            doctorId,
            slotId,
            patientId
        });

        return res.status(200).json({
            message: "Appointment booked successfully",
            data: result
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Something went wrong"
        });
    }
}