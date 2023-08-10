// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import EmployeeDataService from "../../services/EmployeeService";
import SiteDataService from "../../services/SiteService";
import ServiceDataService from "../../services/ServiceService";

// Search by site tab component definition
const SearchBySiteTab = () => {
  // Declaration of state variables
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(-1); // Ajout de l'état
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [siteNames, setSiteNames] = useState({});
  const [serviceNames, setServiceNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 15;
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");

  // useEffect hook to load the list of sites and fetch data
  useEffect(() => {
    // Load the sites list
    SiteDataService.getAll().then((response) => {
      setSites(response.data);
    });

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

  // Function to handle site selection
  const handleSiteSelect = async (event) => {
    const siteId = event.target.value;
    setSelectedSite(siteId);
    setCurrentPage(1);

    // Load the employees by the selectioned site
    if (siteId) {
      try {
        const response = await EmployeeDataService.getBySite(siteId);
        setFilteredEmployees(response.data);
      } catch (error) {
        setMessage(error.response.data.message);
        setShowAlert(true);
        setAlertVariant("danger");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setFilteredEmployees([]);
      }
    } else {
      setFilteredEmployees([]);
    }
  };

  // Function to set active employee
  const setActiveEmployee = (employee, index) => {
    setCurrentEmployee(employee);
    setCurrentIndex(index);
    setSelectedEmployeeIndex(index);
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Return statement for rendering component
  return (
    <div className="row d-flex justify-content-center">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      <div className="col-md-10">
        <Form.Select id="searchBySite" onChange={handleSiteSelect}>
          <option value="" className="text-center">
            Sélectionnez un site
          </option>
          {sites.map((site) => (
            <option key={site.id} className="text-center" value={site.id}>
              {site.city}
            </option>
          ))}
        </Form.Select>
      </div>
      <div className="col-md-6 d-flex flex-column justify-content-center align-items-center mt-3">
        <ul className="list-group">
          {currentEmployees.map((employee, index) => (
            <li
              className={
                "list-group-item " +
                (index === currentIndex || index === selectedEmployeeIndex
                  ? "active"
                  : "")
              }
              onClick={() => setActiveEmployee(employee, index)}
              key={employee.id}
            >
              {employee.firstName} {employee.lastName}
            </li>
          ))}
        </ul>

        {selectedSite && (
          <Pagination className="mt-3" size="md">
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Pagination.Item>{currentPage}</Pagination.Item>
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={indexOfLastEmployee >= filteredEmployees.length}
            />
          </Pagination>
        )}
      </div>

      <div className="col-md-6 mt-3">
        {currentEmployee ? (
          <div className="card">
            <div className="card-header">
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
          <div>{selectedSite && <p>Veuillez cliquer sur un employé</p>}</div>
        )}
      </div>
    </div>
  );
};

export default SearchBySiteTab;