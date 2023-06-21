import React, { useState, useEffect } from "react";
import axios from "axios";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch the initial text from the server
    fetchText();
  }, []);

  const fetchText = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/text"); // Replace "/api/text" with the actual endpoint for fetching the text
      setText(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveText = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/text", { text }); // Replace "/api/text" with the actual endpoint for updating the text
      alert("Text saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save text.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your text here"
        disabled={isLoading}
      />
      <button onClick={saveText} disabled={isLoading}>
        Save
      </button>
    </div>
  );
};

export default TextEditor;
