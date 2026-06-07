import { useEffect, useState } from "react";
import { getDoctors } from "../api/doctorApi";
import DoctorCard from "../components/DoctorCard";

function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getDoctors();
      setDoctors(data);
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = doctor.name
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());

    const matchesSpecialization =
      specialization === "" || doctor.specialization === specialization;

    return matchesName && matchesSpecialization;
  });
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === "expHigh") {
      return b.experience - a.experience;
    }

    if (sortBy === "expLow") {
      return a.experience - b.experience;
    }

    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return 0;
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  return (
    <div className="p-6">
      {/* Search + Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="expHigh">Experience: High to Low</option>
          <option value="expLow">Experience: Low to High</option>
          <option value="name">Name: A to Z</option>
        </select>

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Orthopedic">Orthopedic</option>
          <option value="Neurologist">Neurologist</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-6">
        {sortedDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
