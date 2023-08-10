// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmployeeDataService from "../../services/EmployeeService";
import ServiceDataService from "../../services/ServiceService";
import SiteDataService from "../../services/SiteService";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { VscAdd, VscEdit, VscTrash } from "react-icons/vsc";
import Pagination from "react-bootstrap/Pagination";
import AuthService from "../../services/AuthService";

// Employees list for admin component definition
const EmployeesListAdmin = () => {
  // State variables declaration
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [sites, setSites] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [employeesPerPage, setEmployeesPerPage] = useState(10);
  const [sortedColumn, setSortedColumn] = useState("id");
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [defaultSortDone, setDefaultSortDone] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");
  // Get the authentication headers
  const authHeaders = AuthService.getAuthHeaders();
  const navigate = useNavigate();

  // useEffect hook for retrieving employees
  // and fetching data for the name of the service and the city of the site
  // and sort the list by the employees ID
  useEffect(() => {
    retrieveEmployees();
    retrieveServices();
    retrieveSites();
    if (defaultSortDone) {
      handleSort("id");
      setDefaultSortDone(false);
    }
  }, [defaultSortDone, currentPage, sortOrder]);

  // Function to retrieve employees
  const retrieveEmployees = async () => {
    try {
      const response = await EmployeeDataService.getAllAdmin(authHeaders);
      const employeesData = response.data;

      // Client-side sorting
      const sortedEmployees = employeesData.sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortedColumn] < b[sortedColumn] ? -1 : 1;
        } else {
          return a[sortedColumn] > b[sortedColumn] ? -1 : 1;
        }
      });

      // Update the employees total number
      setTotalEmployees(sortedEmployees.length);

      // Update the employees displayed on the current page
      const startIndex = (currentPage - 1) * employeesPerPage;
      const endIndex = startIndex + employeesPerPage;
      setEmployees(sortedEmployees.slice(startIndex, endIndex));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate("/403");
      } else if (error.response && error.response.status === 404) {
        navigate("/404");
      }
    }
  };

  // Function to retrieve services
  const retrieveServices = () => {
    ServiceDataService.getAll()
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setShowAlert(true);
        setAlertVariant("danger");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  };

  // Function to retrieve sites
  const retrieveSites = () => {
    SiteDataService.getAll()
      .then((response) => {
        setSites(response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setShowAlert(true);
        setAlertVariant("danger");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  };

  // Function to handle sort
  const handleSort = (column) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortedColumn(column);
    retrieveEmployees();
  };

  // Function to handle change pagination
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    retrieveEmployees();
  };

  // Function to handle delete of the employee
  const handleDelete = (id) => {
    EmployeeDataService.remove(id, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        retrieveEmployees();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/403");
        }
        setMessage(error.response.data.message);
        setShowAlert(true);
        setAlertVariant("danger");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  };

  // Function to handle delete all employees
  const handleDeleteAll = () => {
    EmployeeDataService.removeAll(authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        retrieveEmployees();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/403");
        }
        setMessage(error.response.data.message);
        setShowAlert(true);
        setAlertVariant("danger");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  };

  // Return statement for rendering component
  return (
    <div className="container col-md-12 mt-5">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      <h2 className="text-center mb-3">Liste des employés</h2>
      <div className="text-center">
        <Link to={"/employees/new"} className="btn btn-secondary">
          <VscAdd /> Ajouter un nouvel employé
        </Link>
      </div>
      <div className="d-flex justify-content-end mb-3 me-4">
        <button
          className="btn btn-danger text-center"
          onClick={() => handleDeleteAll()}
        >
          <VscTrash /> Tout supprimer
        </button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th onClick={() => handleSort("id")}>
              ID{" "}
              {sortedColumn === "id" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort("lastName")}>
              Nom{" "}
              {sortedColumn === "lastName" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort("firstName")}>
              Prénom{" "}
              {sortedColumn === "firstName" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort("phone")}>
              Fixe{" "}
              {sortedColumn === "phone" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort("mobile")}>
              Mobile{" "}
              {sortedColumn === "mobile" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort("email")}>
              Email{" "}
              {sortedColumn === "email" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort("service_id")}>
              Service{" "}
              {sortedColumn === "service_id" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort("site_id")}>
              Site{" "}
              {sortedColumn === "site_id" ? (
                sortOrder === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const service = services.find(
              (service) => service.id === employee.service_id
            );
            const serviceName = service ? service.name : "N/A";
            const site = sites.find((site) => site.id === employee.site_id);
            const siteCity = site ? site.city : "N/A";

            return (
              <tr key={employee.id} className="text-center align-middle">
                <td>{employee.id}</td>
                <td>{employee.lastName}</td>
                <td>{employee.firstName}</td>
                <td>{employee.phone}</td>
                <td>{employee.mobile}</td>
                <td>{employee.email}</td>
                <td className="align-middle">{serviceName}</td>
                <td className="align-middle">{siteCity}</td>
                <td>
                  <Link
                    to={"/employees/" + employee.id}
                    className="btn btn-outline-primary me-1"
                  >
                    <VscEdit /> Modifier
                  </Link>
                  <button
                    className="btn btn-outline-danger ms-1"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <VscTrash /> Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination className="justify-content-center">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePaginationChange(currentPage - 1)}
        />
        {Array.from(
          { length: Math.ceil(totalEmployees / employeesPerPage) },
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePaginationChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          disabled={
            currentPage === Math.ceil(totalEmployees / employeesPerPage || totalEmployees <= employeesPerPage)
          }
          onClick={() => handlePaginationChange(currentPage + 1)}
        />
      </Pagination>
    </div>
  );
};

export default EmployeesListAdmin;