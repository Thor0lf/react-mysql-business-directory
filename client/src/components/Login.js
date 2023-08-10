import React, { useState } from "react";
import AuthService from "../services/AuthService";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await AuthService.login(email, password);
      onLogin(user);
      navigate("/");
    } catch (error) {
      setError(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <Container className="login-container col-md-4">
      <h2 className="text-center mt-5">Connexion</h2>
      {showAlert && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}
      <Form onSubmit={handleLogin} className="d-flex flex-column mt-4">
        <Form.Group>
          <Form.Control
            type="email"
            value={email}
            placeholder="Email"
            aria-label="Email"
            className="mt-1"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            value={password}
            placeholder="Mot de passe"
            aria-label="Password"
            className="mt-3"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-4">
          Se connecter
        </Button>
      </Form>
    </Container>
  );
}

export default Login;