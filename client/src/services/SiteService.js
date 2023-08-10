// Importing http-common for making HTTP requests
import http from "../http-common";

const getAll = () => {
  return http.get("/sites");
};

const getAllAdmin = (headers) => {
  return http.get("/sites/admin/", { headers: headers });
};

const get = (id) => {
  return http.get(`/sites/${id}`);
};

const getAdmin = (id, headers) => {
  return http.get(`/sites/admin/${id}`, { headers: headers });
};

const create = (data, headers) => {
  return http.post("/sites", data, { headers: headers });
};

const update = (id, data, headers) => {
  return http.put(`/sites/${id}`, data, { headers: headers });
};

const remove = (id, headers) => {
  return http.delete(`/sites/${id}`, { headers: headers });
};

// Exporting all the functions as a module
const SitesService = {
  getAll,
  getAllAdmin,
  get,
  getAdmin,
  create,
  update,
  remove,
};

export default SitesService;