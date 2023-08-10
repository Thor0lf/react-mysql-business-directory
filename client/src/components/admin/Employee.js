// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import AuthService from "../../services/AuthService";
import EmployeeDataService from "../../services/EmployeeService";
import ServiceDataService from "../../services/ServiceService";
import SiteDataService from "../../services/SiteService";

// Employee component definition
const Employee = () => {
  // State variables declaration
  const initialEmployeeState = {
    id: null,
    firstName: "",
    lastName: "",
    phone: "",
    mobile: "",
    email: "",
    service_id: "",
    site_id: "",
  };
  const [currentEmployee, setCurrentEmployee] = useState(initialEmployeeState);
  const [services, setServices] = useState([]);
  const [sites, setSites] = useState([]);
  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");
  // Get the authentication headers
  const authHeaders = AuthService.getAuthHeaders();
  const navigate = useNavigate();
  const { id } = useParams();

  // useEffect hook for retrieving the employee if exists
  // and fetching data for the name of the service and the city of the site
  useEffect(() => {
    retrieveServices();
    retrieveSites();
    if (id) {
      getEmployee(id);
      setIsNewEmployee(false);
    } else {
      // if url is for the new employee, the currentEmployee stays empty
      setIsNewEmployee(true);
    }
  }, [id]);

  // Get the employee by its ID if it exists
  const getEmployee = (id) => {
    EmployeeDataService.get(id, authHeaders)
      .then((response) => {
        setCurrentEmployee(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/403");
        } else if (error.response && error.response.status === 404) {
          navigate("/404");
        }
      });
  };

  // Function to handle the employee creation
  const handleCreateEmployee = () => {
    EmployeeDataService.create(currentEmployee, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/employees");
        }, 3000);
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

  // Function to update the employee
  const updateEmployee = () => {
    EmployeeDataService.update(currentEmployee.id, currentEmployee, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/employees");
        }, 3000);
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

  // Function to handle the input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };

  // Get the services list
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

  // Get the sites list
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

  // Return statement for rendering component
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      {isNewEmployee || currentEmployee ? (
        <div className="edit-form col-sm-6">
          {isNewEmployee ? (
            <h3 className="text-center my-3">Création d'un employé</h3>
          ) : (
            <h3 className="text-center my-3">Modification d'un employé</h3>
          )}
          <form className="text-center fw-bold">
            <div className="form-group mt-3">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                placeholder="Prénom de l'employé"
                value={currentEmployee.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Nom de l'employé"
                value={currentEmployee.lastName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="phone">Fixe</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="Numéro de téléphone fixe"
                value={currentEmployee.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="mobile">Mobile</label>
              <input
                type="tel"
                className="form-control"
                id="mobile"
                name="mobile"
                placeholder="Numéro de téléphone mobile"
                value={currentEmployee.mobile}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Adresse email"
                value={currentEmployee.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group mt-3 col-md-6 mx-auto">
              <label htmlFor="service">Service</label>
              <select
                className="form-control text-center"
                id="service"
                name="service_id"
                value={currentEmployee.service_id}
                onChange={handleInputChange}
              >
                <option value="" className="text-center">
                  Sélectionnez un service
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3 col-md-6 mx-auto">
              <label htmlFor="site">Site</label>
              <select
                className="form-control text-center"
                id="site"
                name="site_id"
                value={currentEmployee.site_id}
                onChange={handleInputChange}
              >
                <option value="" className="text-center">
                  Sélectionnez un site
                </option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.city}
                  </option>
                ))}
              </select>
            </div>
          </form>

          <div className="d-flex justify-content-evenly mt-5 mb-3">
            <Link to={"/employees"} className="btn btn-primary text-white">
              Retour
            </Link>
            {isNewEmployee ? (
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleCreateEmployee}
              >
                Enregistrer
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
                onClick={updateEmployee}
              >
                Mettre à jour
              </button>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Employee;