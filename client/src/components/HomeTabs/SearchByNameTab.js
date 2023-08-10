// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";
import EmployeeDataService from "../../services/EmployeeService";
import SiteDataService from "../../services/SiteService";
import ServiceDataService from "../../services/ServiceService";

// Search by name tab component definition
const SearchByNameTab = () => {
  // State variables declaration
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchName, setSearchName] = useState("");
  const [siteNames, setSiteNames] = useState({});
  const [serviceNames, setServiceNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(15);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(-1);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");

  // Function to handle search name change
  const onChangeSearchName = (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  // Function to retrieve employees
  const retrieveEmployees = async (page) => {
    try {
      const offset = (page - 1) * employeesPerPage;
      let response;

      if (searchName) {
        response = await EmployeeDataService.findByName(
          searchName,
          employeesPerPage,
          offset
        );
      } else {
        response = await EmployeeDataService.getAll(employeesPerPage, offset);
      }

      const employeesData = response.data;
      setEmployees(employeesData);
    } catch (error) {
      setMessage(error.response.data.message);
      setShowAlert(true);
      setAlertVariant("danger");
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  // Function to find employees by name
  const findByName = (page) => {
    const offset = (page - 1) * employeesPerPage;

    EmployeeDataService.findByName(searchName, employeesPerPage, offset)
      .then((response) => {
        const employeesData = response.data;
        setEmployees(employeesData);
        setCurrentPage(1);
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

  // Function to set active employee
  const setActiveEmployee = (employee, index) => {
    setCurrentEmployee(employee);
    setCurrentIndex(index);
    setSelectedEmployeeIndex(index);
  };

  // Function to handle search key down event
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      findByName();
    }
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    retrieveEmployees(pageNumber);
  };

  // useEffect hook for retrieving employees and fetching data
  // for the name of the service and the city of the site
  useEffect(() => {
    retrieveEmployees();

    // Get the name of the service and the city of the site by their ID
    if (currentEmployee) {
      const fetchData = async () => {
        try {
          const responseService = await ServiceDataService.get(
            currentEmployee.service_id
          );
          const serviceNamesMap = { ...serviceNames };
          serviceNamesMap[currentEmployee.service_id] =
            responseService.data.name;
          setServiceNames(serviceNamesMap);
          const responseSite = await SiteDataService.get(
            currentEmployee.site_id
          );
          const siteNamesMap = { ...siteNames };
          siteNamesMap[currentEmployee.site_id] = responseSite.data.city;
          setSiteNames(siteNamesMap);
        } catch (error) {
          setMessage(error.response.data.message);
          setShowAlert(true);
          setAlertVariant("danger");
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      };

      fetchData();
    }
  }, [currentEmployee]);

  // Return statement for rendering component
  return (
    <div className="list row d-flex justify-content-center">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      <div className="col-md-8">
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            className="form-control"
            placeholder="Rechercher le nom d'un employé"
            aria-label="Search"
            aria-describedby="basic-addon2"
            value={searchName}
            onChange={onChangeSearchName}
            onKeyDown={handleSearchKeyDown}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={findByName}
          >
            Rechercher
          </Button>
        </InputGroup>
      </div>
      <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
        <ul className="list-group">
          {employees &&
            employees.map((employee, index) => (
              <li
                className={
                  "list-group-item " +
                  (index === currentIndex || index === selectedEmployeeIndex
                    ? "active"
                    : "")
                }
                onClick={() => setActiveEmployee(employee, index)}
                key={index}
              >
                {employee.lastName} {employee.firstName}
              </li>
            ))}
        </ul>

        <Pagination className="mt-3" size="md">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <Pagination.Item>{currentPage}</Pagination.Item>
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={employees.length < employeesPerPage}
          />
        </Pagination>
      </div>
      <div className="col-md-6">
        {currentEmployee ? (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <strong>
                {currentEmployee.lastName} {currentEmployee.firstName}
              </strong>
            </div>
            <div className="card-body">
              <div className="mb-2"></div>
              <div className="mb-2">fixe: {currentEmployee.phone}</div>
              <div className="mb-2">mobile: {currentEmployee.mobile}</div>
              <div className="mb-2">email: {currentEmployee.email}</div>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <span className="ms-1">
                service {serviceNames[currentEmployee.service_id]}
              </span>
              <span className="me-1">{siteNames[currentEmployee.site_id]}</span>
            </div>
          </div>
        ) : (
          <div>
            <br />
            <p>Veuillez cliquer sur un employé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchByNameTab;