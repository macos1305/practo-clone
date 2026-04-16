import { useEffect, useState } from "react";
import { getDoctors } from "../api/doctorApi";
import DoctorCard from "../components/DoctorCard";

function HomePage() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getDoctors();
      setDoctors(data);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

export default HomePage;
