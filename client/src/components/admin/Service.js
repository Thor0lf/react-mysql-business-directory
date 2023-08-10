// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import ServiceDataService from "../../services/ServiceService";
import AuthService from "../../services/AuthService";

// Service component definition
const Service = () => {
  // State variables declaration

  const initialServiceState = {
    id: null,
    name: "",
  };
  const [currentService, setCurrentService] = useState(initialServiceState);
  const [isNewService, setIsNewService] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger"); // Get the authentication headers
  const authHeaders = AuthService.getAuthHeaders();
  const navigate = useNavigate();
  const { id } = useParams();

  // useEffect hook for retrieving  the service if exists
  useEffect(() => {
    if (id) {
      getService(id);
      setIsNewService(false);
    } else {
      // if url is for the new service, the currentService stays empty
      setIsNewService(true);
    }
  }, [id]);

  // Get the service by its ID if it exists
  const getService = (id) => {
    ServiceDataService.getAdmin(id, authHeaders)
      .then((response) => {
        setCurrentService(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/403");
        } else if (error.response && error.response.status === 404) {
          navigate("/404");
        }
      });
  };

  // Function to handle the service creation
  const handleCreateService = () => {
    ServiceDataService.create(currentService, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/services");
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

  // Function to update the service
  const updateService = () => {
    ServiceDataService.update(currentService.id, currentService, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/services");
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
    setCurrentService({ ...currentService, [name]: value });
  };

  // Return statement for rendering component
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      {isNewService || currentService ? (
        <div className="edit-form">
          {isNewService ? (
            <h4 className="text-center my-5">Création d'un service</h4>
          ) : (
            <h4 className="text-center my-5">Modification d'un service</h4>
          )}
          <form>
            <div className="form-group text-center mt-3">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Nom du nouveau service"
                value={currentService.name}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <div className="d-flex justify-content-around mt-5">
            <Link to={"/services"} className="btn btn-primary text-white">
              Retour
            </Link>
            {isNewService ? (
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleCreateService}
              >
                Enregistrer
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
                onClick={updateService}
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

export default Service;