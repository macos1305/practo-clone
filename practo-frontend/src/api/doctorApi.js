import apiClient from "../services/apiClient";

export const getDoctorById = async (id) => {
  const response = await apiClient.get(`/doctor/${id}`);
  return response.data;
};
export const getDoctorSlots = async (id) => {
  const response = await apiClient.get(`/doctor/${id}/slots`);
  return response.data;
};
