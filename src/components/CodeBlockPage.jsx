import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "bootstrap/dist/css/bootstrap.min.css";

const CodeBlockPage = ({ codeBlock }) => {
  const [code, setCode] = useState(codeBlock.code);
  const [socket, setSocket] = useState(null);
  const [isMentor, setIsMentor] = useState(false);

  // Effect hook to set up socket connection and handle code updates
  useEffect(() => {
    const newSocket = io("online-coding-app-server.railway.internal");
    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    // Event listener for receiving updated code blocks from the server
    newSocket.on("updated_codeblock", (updatedCodeBlock) => {
      if (updatedCodeBlock.id === codeBlock.id) {
        setCode(updatedCodeBlock.code);
      }
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const checkIfMentor = async () => {
      const response = await fetch("http://online-coding-app-server.railway.internal/user_info", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setIsMentor(data.isMentor);

      // If user is a mentor, send a post request
      if (data.isMentor) {
        alert("Hi Tom :)");
        await fetch("http://online-coding-app-server.railway.internal/user_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isMentor: false,
          }),
        });
      }
    };
    // Call the function to check if the user is a mentor
    checkIfMentor();
  }, []);

  // Function to handle changes in the code editor and update the server
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && socket.connected) {
      socket.emit("update_codeblock", {
        codeblock_id: codeBlock.id,
        code: newCode,
      });
    }
  };

  return (
    <div className="container mt-5">
      <h1>{codeBlock.title}</h1>
      <div className="mb-5">
        <h2 className="text-center mb-4">Code Block Details</h2>
        {/* Syntax highlighting for the code block */}
        <SyntaxHighlighter language="javascript" style={darcula}>
          {code}
        </SyntaxHighlighter>
      </div>
      {/* Conditional rendering of the code editor for mentors */}
      {!isMentor && (
        <div>
          <h2>Code Editor</h2>
          {/* Textarea for mentors to edit and update the code */}
          <textarea
            className="form-control"
            rows="20"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default CodeBlockPage;
