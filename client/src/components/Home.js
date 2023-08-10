// Importing necessary libraries and components
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SearchByNameTab from "./HomeTabs/SearchByNameTab";
import SearchByServiceTab from "./HomeTabs/SearchByServiceTab";
import SearchBySiteTab from "./HomeTabs/SearchBySiteTab";

// Home component definition
const Home = () => {
  // Return statement for rendering component
  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <Tabs defaultActiveKey="1" className="mb-3">
        <Tab eventKey="1" title="Rechercher par nom">
          <SearchByNameTab />
        </Tab>

        <Tab eventKey="2" title="Rechercher par service">
          <SearchByServiceTab />
        </Tab>

        <Tab eventKey="3" title="Rechercher par site">
          <SearchBySiteTab />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Home;