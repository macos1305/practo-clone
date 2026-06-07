async function findDoctors({ search, specialization }) {
  let query = `SELECT * FROM doctors WHERE 1=1`;
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    query += ` AND name LIKE ?`;
  }

  if (specialization) {
    values.push(specialization);
    query += ` AND specialization = ?`;
  }

  const [rows] = await db.execute(query, values);
  return rows;
}
