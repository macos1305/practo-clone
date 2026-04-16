import { Link } from "react-router-dom";
function DoctorCard({ doctor }) {
  return (
   <Link to={`/doctor/${doctor.id}`}>
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{doctor.name}</h2>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p className="text-sm text-gray-500">
        Experience: {doctor.experience} years
      </p>
    </div>
    </Link>
  );
}

export default DoctorCard;
