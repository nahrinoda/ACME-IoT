import React, { Component } from "react";
import Demo from "../components/DevicesTable/DevicesTable";
// import SimpleModal from "./components/BlackberryTest/BlackberryTest"

import "./app.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="header">
          <h3>ACME WebApplication</h3>
        </div>

        <Demo />
      </div>
    );
  }
}

export default App;
