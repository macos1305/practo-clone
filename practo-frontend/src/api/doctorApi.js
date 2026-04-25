import apiClient from "./apiClient";

export const getDoctorById = async (id) => {
  const response = await apiClient.get(`/doctor/${id}`);
  return response.data;
};
export const getDoctorSlots = async (id) => {
  const response = await apiClient.get(`/doctor/${id}/slots`);
  return response.data;
};
export const getDoctors = async ({ search = "", specialization = "" }) => {
  const response = await apiClient.get("/doctors", {
    params: { search, specialization },
  });

  return response.data;
};