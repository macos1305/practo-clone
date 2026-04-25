async function getDoctors(req, res) {
  try {
    const { search, specialization } = req.query;

    const doctors = await doctorService.getDoctors({
      search,
      specialization,
    });

    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
}
