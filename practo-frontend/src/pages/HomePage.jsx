import { useEffect, useState } from "react";
import { getDoctors } from "../api/doctorApi";
import DoctorCard from "../components/DoctorCard";

function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = doctor.name
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());

    const matchesSpecialization =
      specialization === "" || doctor.specialization === specialization;

    return matchesName && matchesSpecialization;
  });

  // Sort doctors
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

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Find Doctors</h1>

        <p className="text-gray-600 mt-1">
          Search and book appointments with top specialists
        </p>
      </div>

      {/* Search + Filter + Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-lg w-full"
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-3 rounded-lg w-full md:w-auto"
        >
          <option value="">Sort By</option>

          <option value="expHigh">Experience: High to Low</option>

          <option value="expLow">Experience: Low to High</option>

          <option value="name">Name: A to Z</option>
        </select>

        {/* Filter */}
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border p-3 rounded-lg w-full md:w-auto"
        >
          <option value="">All Specializations</option>

          <option value="Cardiologist">Cardiologist</option>

          <option value="Dermatologist">Dermatologist</option>

          <option value="Orthopedic">Orthopedic</option>

          <option value="Neurologist">Neurologist</option>
        </select>
      </div>

      {/* Doctors Grid */}
      {sortedDoctors.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No doctors found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
