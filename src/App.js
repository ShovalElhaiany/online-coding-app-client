import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { toUrlFormat } from "./utils.js";
import LobbyPage from "./components/LobbyPage.jsx";
import CodeBlockPage from "./components/CodeBlockPage.jsx";

const App = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  // Fetching code blocks from the server when the component mounts
  useEffect(() => {
    fetch("http://online-coding-app-server/get_codeblocks", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setCodeBlocks(responseData.data);
      });
  }, []);

  // Rendering the application structure with React Router
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LobbyPage codeBlocks={codeBlocks} />} />
        {/* Generating routes for each code block */}
        {codeBlocks.map((block) => (
          <Route
            key={block.id}
            path={`/${toUrlFormat(block.title)}`}
            element={<CodeBlockPage codeBlock={block} />}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
