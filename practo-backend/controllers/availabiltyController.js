async function createAvailability(req, res) {
    try{
        const doctorId = req.body.doctorId;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const role = req.user.role;
        if (role != "doctor" && role != "admin" && role != "receptionist") {
          return res.status(403).json({
            message: "You are not allowed to create slots",
          });
        }

        const result = await createAvailabilityService({
          doctorId,
          date,
          startTime,
          endTime,
        });
        
        return res.status(201).json({
            message: "The availability is successfully updated",
            data: result
        });
     }
     catch(error){
        if(error.message.includes("Invalid")){
            return res.status(400).json({
                message: "The provided data is invalid"
            })
        }
        else if(error.message.includes("forbidden")){
            return res.status(403).json({
                message: "You are not allowed to create availability for this doctor"
            })
        }
        else if(error.message.includes("not found")){
            return res.status(404).json({
                message: "Doctor not found"
            })
        }
        else if(error.message.includes("conflict")){
            return res.status(409).json({
                message: "Availability overlaps with existing availability"
            })
        }
        else{
            return res.status(500).json({
                message: "Internal server error"
            })
        }

         }

}