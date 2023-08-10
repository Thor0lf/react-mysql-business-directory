import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div className="text-center">
        <h1 className="mt-5">404 - Page non trouvée</h1>
        <h3>La page que recherchez n'existe pas.</h3>
      </div>
      <div className="text-center mt-5">
        Retour à la
        <Link to={"/"} className="btn-link ms-1">
          page d'accueil
        </Link>
      </div>
    </>
  );
};

export default NotFound;