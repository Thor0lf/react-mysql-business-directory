// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ServiceDataService from "../../services/ServiceService";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { VscAdd, VscEdit, VscTrash } from "react-icons/vsc";
import AuthService from "../../services/AuthService";

// Services list for admin component definition
const ServicesList = () => {
  // State variables declaration
  const [services, setServices] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState("id");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");
  // Get the authentication headers
  const authHeaders = AuthService.getAuthHeaders();
  const navigate = useNavigate();

  // useEffect hook for retrieving services
  useEffect(() => {
    retrieveServices();
  }, []);

  // Function to retrieve services
  const retrieveServices = () => {
    ServiceDataService.getAllAdmin(authHeaders)
      .then((response) => {
        setServices(response.data);
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

  // Function to handle sort
  const handleSort = (column) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortedColumn(column);
    sortServices(column, newOrder);
  };

  // Function to sort services
  const sortServices = (column, order) => {
    const sortedServices = [...services].sort((a, b) => {
      if (order === "asc") {
        return a[column] < b[column] ? -1 : 1;
      } else {
        return a[column] > b[column] ? -1 : 1;
      }
    });
    setServices(sortedServices);
  };

  // Function to handle delete of the service
  const handleDelete = (id) => {
    ServiceDataService.remove(id, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        retrieveServices();
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
    <div className="container col-md-8 mt-5">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      <h2 className="text-center mb-3">Liste des services</h2>
      <div className="text-center">
        <Link to={"/services/new"} className="btn btn-secondary mb-3">
          <VscAdd /> Ajouter un nouveau service
        </Link>
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
            <th onClick={() => handleSort("name")}>
              Nom du service{" "}
              {sortedColumn === "name" ? (
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
          {services.map((service) => (
            <tr key={service.id} className="text-center align-middle">
              <td>{service.id}</td>
              <td>{service.name}</td>
              <td>
                <Link
                  to={"/services/" + service.id}
                  className="btn btn-outline-primary me-1"
                >
                  <VscEdit /> Modifier
                </Link>
                <button
                  className="btn btn-outline-danger ms-1"
                  onClick={() => handleDelete(service.id)}
                >
                  <VscTrash /> Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ServicesList;