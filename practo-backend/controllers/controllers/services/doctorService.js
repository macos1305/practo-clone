async function getDoctors({ search, specialization }) {
  return await doctorRepository.findDoctors({
    search,
    specialization,
  });
}
