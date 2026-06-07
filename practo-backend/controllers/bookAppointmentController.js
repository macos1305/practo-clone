async function postBookAppointment(req, res) {
     try{
        const { doctorId,slotId } = req.body;
        const patientId = req.user.Id;

        const appointment  = await bookAppointment({ doctorId, slotId, patientId});

        return res.status(201).json({
            message:"Appointment booked successfully",
            data:appointment
        })
     }
     catch(error){
        if(error.message.includes("Invalid")){
           return res.status(400).json({
            message:"The provided data is invalid"
           })
        }
        else if(error.message.includes("does not exist")){
            return res.status(404).json({
                message:"This slot does not exsist"
            })
        }
        else if(error.message.includes("does not belong")){
            return res.status(403).json({
                message:"the slot does not belong to the particular doctor"
            })
        }
        else if(error.message.includes("not available")){
            return res.status(409).json({
                message:"the slot is not aavailable "
            })
        }
        else{
            return res.status(500).json({
                message:"Something went wrong"
            })
        }

     }
}