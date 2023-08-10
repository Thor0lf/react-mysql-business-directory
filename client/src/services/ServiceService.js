// Importing http-common for making HTTP requests
import http from "../http-common";

const getAll = () => {
  return http.get("/services");
};

const getAllAdmin = (headers) => {
  return http.get("/services/admin/", { headers: headers });
};

const get = (id) => {
  return http.get(`/services/${id}`);
};

const getAdmin = (id, headers) => {
  return http.get(`/services/admin/${id}`, { headers: headers });
};

const create = (data, headers) => {
  return http.post("/services", data, { headers: headers });
};

const update = (id, data, headers) => {
  return http.put(`/services/${id}`, data, { headers: headers });
};

const remove = (id, headers) => {
  return http.delete(`/services/${id}`, { headers: headers });
};

// Exporting all the functions as a module
const ServicesService = {
  getAll,
  getAllAdmin,
  get,
  getAdmin,
  create,
  update,
  remove,
};

export default ServicesService;