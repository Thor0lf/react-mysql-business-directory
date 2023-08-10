import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { VscSignOut } from "react-icons/vsc";
import EmployeesList from "./components/Home";
import Login from "./components/Login";
import AuthService from "./services/AuthService";
import EmployeesListAdmin from "./components/admin/EmployeesList";
import Employee from "./components/admin/Employee";
import ServicesList from "./components/admin/ServicesList";
import Service from "./components/admin/Service";
import SitesList from "./components/admin/SitesList";
import Site from "./components/admin/Site";
import Forbidden from "./components/errors/403";
import NotFound from "./components/errors/404";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="top">
      <Navbar expand="lg" bg="primary" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/" className="text-white fw-bold">
            Annuaire d'entreprise
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="menu ms-5">
                Accueil
              </Nav.Link>
              {currentUser ? (
                <Nav>
                  <Nav.Link href="/employees" className="menu ms-3">
                    Liste des employés
                  </Nav.Link>
                  <Nav.Link href="/services" className="menu ms-3">
                    Liste des services
                  </Nav.Link>
                  <Nav.Link href="/sites" className="menu ms-3">
                    Liste des sites
                  </Nav.Link>
                </Nav>
              ) : (
                <></>
              )}
            </Nav>
            {currentUser ? (
              <Nav>
                <NavDropdown
                  className="user"
                  title={`Bonjour, ${currentUser.fullname}`}
                  id="user-nav-dropdown"
                >
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="logout text-danger fw-bold"
                  >
                    <VscSignOut /> Déconnexion
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link href="/login" className="text-white">
                  Connexion
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<EmployeesList />} />
          <Route path="/employees" element={<EmployeesListAdmin />} />
          <Route path="/employees/new" element={<Employee />} />
          <Route path="/employees/:id" element={<Employee />} />
          <Route path="/services" element={<ServicesList />} />
          <Route path="/services/new" element={<Service />} />
          <Route path="/services/:id" element={<Service />} />
          <Route path="/sites" element={<SitesList />} />
          <Route path="/sites/new" element={<Site />} />
          <Route path="/sites/:id" element={<Site />} />
          <Route
            path="/login"
            element={
              <Login
                onLogin={() => setCurrentUser(AuthService.getCurrentUser())}
              />
            }
          />
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;