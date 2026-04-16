async function cancelAppointment({ appointmentId, userRole, userId }) {
    if(!appointmentId||!userRole||!userId){
       throw new Error("Invalid Appointment data"); 
    }
    const appointment = await appointmentRepository.findById(appointmentId);
    if(!appointment){
        throw new Error("Appointment not found");
    }
    if (userRole === "admin" || (userRole === "patient" && appointment.patientId === userId) || (userRole === "doctor" && appointment.doctorId === userId)) {
       if(appointment.status === "CANCELLED"){
           throw new Error("Appointment is already cancelled");
       }
       if(appointment.status === "COMPLETED"){
           throw new Error("Cannot cancel a completed appointment");
       }
       if(appointment.status === "IN_PROGRESS"){
              throw new Error("Cannot cancel an appointment in progress");
         }
       
    } else {
        throw new Error("Unauthorized to cancel this appointment");
    }
    const cancelledBy =userRole === "admin" ? "Admin"  : userRole === "patient" ? `Patient ${userId}` : `Doctor ${userId}`;
    const cancelledAt = new Date();
    const currentTime = new Date();

    const updatedAppointment = await appointmentRepository.cancelAppointment({
        appointmentId, cancelledBy, cancelledAt});
    
    
    if (new Date(updatedAppointment.startTime) > currentTime) {
      await slotRepository.reopenSlot(updatedAppointment.slotId);
    }

    return {
        appointmentId: updatedAppointment.id,
        status:"CANCELLED",
        cancelledBy,
        cancelledAt,
        message:"Appointment cancelled successfully"
    }
    
}




