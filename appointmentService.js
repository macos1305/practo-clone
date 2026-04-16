async function bookAppointment({ doctorId, slotId, patientId }){

    if(!doctorId || !slotId || !patientId){
        throw new Error("Invalid booking data");
    } 

    const slot = await slotRepository.findSlotById(slotId);
     
    if(!slot){
        throw new Error("Slot does not exsist");
    }

    if(slot.doctorId !== doctorId) {
        throw new Error("Slot does not belong to selected doctor");
    }

    if(slot.status !== "FREE"){
        throw new Error("Slot already booked");
    }

    const appointment = await appointmentRepository.createappointment({
        doctorId,
        patientId,
        slotId
    });

    return appointment;
}