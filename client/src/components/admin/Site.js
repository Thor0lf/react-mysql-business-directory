// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import SiteDataService from "../../services/SiteService";
import AuthService from "../../services/AuthService";

// Site component definition
const Site = () => {
  // State variables declaration
  const initialSiteState = {
    id: null,
    city: "",
  };
  const [currentSite, setCurrentSite] = useState(initialSiteState);
  const [isNewSite, setIsNewSite] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger"); // Get the authentication headers
  const authHeaders = AuthService.getAuthHeaders();
  const navigate = useNavigate();
  const { id } = useParams();

  // useEffect hook for retrieving the site if exists
  useEffect(() => {
    if (id) {
      getSite(id);
      setIsNewSite(false);
    } else {
      // if url is for the new site, the currentSite stays empty
      setIsNewSite(true);
    }
  }, [id]);

  // Get the site by its ID if it exists
  const getSite = (id) => {
    SiteDataService.getAdmin(id, authHeaders)
      .then((response) => {
        setCurrentSite(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/403");
        } else if (error.response && error.response.status === 404) {
          navigate("/404");
        }
      });
  };

  // Function to handle the site creation
  const handleCreateSite = () => {
    SiteDataService.create(currentSite, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/sites");
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

  // Function to update the site
  const updateSite = () => {
    SiteDataService.update(currentSite.id, currentSite, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
          navigate("/sites");
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
    setCurrentSite({ ...currentSite, [name]: value });
  };

  // Return statement for rendering component
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      {isNewSite || currentSite ? (
        <div className="edit-form">
          {isNewSite ? (
            <h3 className="text-center my-5">Création d'un site</h3>
          ) : (
            <h3 className="text-center my-5">Modification d'un site</h3>
          )}
          <form>
            <div className="form-group text-center mt-3">
              <label htmlFor="name">Ville</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                placeholder="Ville du site"
                value={currentSite.city}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <div className="d-flex justify-content-around mt-5">
            <Link to={"/sites"} className="btn btn-primary text-white">
              Retour
            </Link>
            {isNewSite ? (
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleCreateSite}
              >
                Enregister
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
                onClick={updateSite}
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

export default Site;