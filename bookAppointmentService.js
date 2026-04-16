async function bookAppointment({doctorId, slotId, patientId }){
  //validating input
  if (!doctorId || !slotId || !patientId) {
    //detecting invalid data
    //validation error
    throw new Error("Invalid booking data");
  }
  //assigning slot
  const slot = await slotRepository.findById(slotId);
  //checking if slot is available or not
  if (!slot) {
    //business error
    //slot doesnot exist
    throw new Error("slot doesnot exist ");
  }
  //verifying slot Id

  if (slot.doctorId != doctorId) {
    //validation error
    //id mismatch
    throw new Error("Slot does not belong to selected doctor");
  
  }
//locking the slot
  const slotLocked = await slotRepository.lockTheSlot(slotId);

  if (!slotLocked) {
    //slot not available
    throw new Error("Slot is not available");
  }
 

  try{
    //creating appointment
    const createdAppointment = await appointmentRepository.createAppointment({
      doctorId,
      patientId,
      slotId,
    });

    //updating slot status
    const slotUpdated = await slotRepository.updateSlotStatus(
      slotId,
      "BOOKED"
    );
    //rollback
    if (!slotUpdated) {
      if (createdAppointment && createdAppointment.id) {
        const deleteAppointment = await appointmentRepository.deleteAppointment(
          createdAppointment.id
        );
      }

      throw new Error("Failed to book appointment");
    }
  //returning appointment

    return createdAppointment;
  }
  catch(err){
    
    //throw error
    throw(err);
} 
finally {
    //releasing the slot
    const releaseSlot = await slotRepository.releaseTheSlot(slotId);
  }
}