import apiClient from "./apiClient";
export const bookAppointment = async ({ doctorId, slotId }) => {
  const response = await apiClient.post(`/appointments`, {
    doctorId,
    slotId,
  });
  return response.data;
};
export const getAppointments = async () => {
  const response = await apiClient.get(`/appointments`);
  return response.data;
};
export const cancelAppointment = async (appointmentId) => {
  const response = await apiClient.delete(`/appointments/${appointmentId}`);
  return response.data;
};
export const rescheduleAppointment = async (appointmentId, slotId) => {
  const response = await apiClient.put(
    `/appointments/${appointmentId}/reschedule`,
    { slotId },
  );

  return response.data;
};
export const getDoctorAppointments = async () => {
  const response = await apiClient.get("/doctor/appointments");
  return response.data;
};
export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await apiClient.patch(
    `/appointments/${appointmentId}/status`,
    { status },
  );

  return response.data;
};