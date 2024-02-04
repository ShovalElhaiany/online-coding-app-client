import React from "react";
import { Link } from "react-router-dom";
import { toUrlFormat } from "../utils.js";
import "bootstrap/dist/css/bootstrap.min.css";

const LobbyPage = ({ codeBlocks }) => {
  return (
    <div className="container mt-5">
      <div className="col-md-8 offset-md-2">
        <h1 className="text-center mb-5">Choose code block</h1>
        <ul className="list-group">
          {/* Mapping through the codeBlocks array to generate list items */}
          {codeBlocks.map(({ id, title }) => (
            <li key={id} className="list-group-item">
              <Link to={`/${toUrlFormat(title)}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LobbyPage;
