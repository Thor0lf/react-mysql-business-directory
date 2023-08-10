// Importing necessary libraries and services
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteDataService from "../../services/SiteService";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { VscAdd, VscEdit, VscTrash } from "react-icons/vsc";
import AuthService from "../../services/AuthService";

// Sites list for admin component definition
const SitesList = () => {
  // State variables declaration
  const [sites, setSites] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState("id");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("danger");
  // Get the authentication headers
  const authHeaders = AuthService.getAuthHeaders();
  const navigate = useNavigate();

  // useEffect hook for retrieving sites
  useEffect(() => {
    retrieveSites();
  }, []);

  // Function to retrieve sites
  const retrieveSites = () => {
    SiteDataService.getAllAdmin(authHeaders)
      .then((response) => {
        setSites(response.data);
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
    sortSites(column, newOrder);
  };

  // Function to sort sites
  const sortSites = (column, order) => {
    const sortedSites = [...sites].sort((a, b) => {
      if (order === "asc") {
        return a[column] < b[column] ? -1 : 1;
      } else {
        return a[column] > b[column] ? -1 : 1;
      }
    });
    setSites(sortedSites);
  };

  // Function to handle delete of the site
  const handleDelete = (id) => {
    SiteDataService.remove(id, authHeaders)
      .then((response) => {
        setMessage(response.data.message);
        setShowAlert(true);
        setAlertVariant("success");
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        retrieveSites();
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

  return (
    <div className="container col-md-8 mt-5">
      {showAlert && (
        <Alert variant={alertVariant} className="mt-3">
          {message}
        </Alert>
      )}
      <h2 className="text-center mb-3">Liste des sites</h2>
      <div className="text-center">
        <Link to={"/sites/new"} className="btn btn-secondary mb-3">
          <VscAdd /> Ajouter un nouveau site
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
            <th onClick={() => handleSort("city")}>
              Ville{" "}
              {sortedColumn === "city" ? (
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
          {sites.map((site) => (
            <tr key={site.id} className="text-center align-middle">
              <td>{site.id}</td>
              <td>{site.city}</td>
              <td>
                <Link
                  to={"/sites/" + site.id}
                  className="btn btn-outline-primary me-1"
                >
                  <VscEdit /> Modifier
                </Link>
                <button
                  className="btn btn-outline-danger ms-1"
                  onClick={() => handleDelete(site.id)}
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

export default SitesList;