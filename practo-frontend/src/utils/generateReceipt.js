import jsPDF from "jspdf";

export const generateReceipt = ({
  patientName,
  doctorName,
  appointmentTime,
  appointmentId,
  amount,
  status,
}) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Appointment Receipt", 20, 20);

  doc.setFontSize(12);

  doc.text(`Appointment ID: ${appointmentId}`, 20, 40);
  doc.text(`Patient: ${patientName}`, 20, 50);
  doc.text(`Doctor: ${doctorName}`, 20, 60);

  doc.text(`Time: ${new Date(appointmentTime).toLocaleString()}`, 20, 70);

  doc.text(`Amount Paid: ₹${amount}`, 20, 80);

  doc.text(`Status: ${status}`, 20, 90);

  doc.save("appointment-receipt.pdf");
};
