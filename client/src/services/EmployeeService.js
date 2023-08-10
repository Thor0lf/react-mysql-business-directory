// Importing http-common for making HTTP requests
import http from "../http-common";

const getAll = (limit, offset) => {
  return http.get(`/employees?limit=${limit}&offset=${offset}`);
};

const getAllAdmin = (headers) => {
  return http.get("/employees/admin/", { headers: headers });
};

const get = (id, headers) => {
  return http.get(`/employees/${id}`, { headers: headers });
};

const create = (data, headers) => {
  return http.post("/employees", data, { headers: headers });
};

const update = (id, data, headers) => {
  return http.put(`/employees/${id}`, data, { headers: headers });
};

const remove = (id, headers) => {
  return http.delete(`/employees/${id}`, { headers: headers });
};

const removeAll = (headers) => {
  return http.delete(`/employees`, { headers: headers });
};

const findByName = (name, limit, offset) => {
  return http.get(`/employees?name=${name}&limit=${limit}&offset=${offset}`);
};

const getByService = (serviceId, limit, offset) => {
  return http.get(
    `/employees?service_id=${serviceId}&limit=${limit}&offset=${offset}`
  );
};

const getBySite = (siteId, limit, offset) => {
  return http.get(
    `/employees?site_id=${siteId}&limit=${limit}&offset=${offset}`
  );
};

// Exporting all the functions as a module
const EmployeeService = {
  getAll,
  getAllAdmin,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
  getByService,
  getBySite,
};

export default EmployeeService;