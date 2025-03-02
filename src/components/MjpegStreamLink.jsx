import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const MjpegStreamLink = ({ defaultUrl }) => {
  const [customUrl, setCustomUrl] = useState(defaultUrl);
  const [showInput, setShowInput] = useState(false);

  // Function to navigate to the entered URL
  const handleNavigate = () => {
    if (customUrl.trim() !== "") {
      let formattedUrl = customUrl.trim();

      // Ensure the URL starts with http:// or https://
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = "http://" + formattedUrl;
      }

      // Append /mjpeg/1 if it's not already present
      if (!formattedUrl.endsWith("/mjpeg/1")) {
        formattedUrl += "/mjpeg/1";
      }

      window.location.href = formattedUrl;
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      fontFamily="'Roboto', sans-serif"
    >
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Live Camera Feed
        </Typography>

        {/* Small text to toggle input visibility */}
        {!showInput && (
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontSize: "10px", marginBottom: "4px" }}
            onClick={() => setShowInput(true)}
          >
            Click here to enter URL (Optional)
          </Typography>
        )}

        {/* Input Field for Custom URL (Hidden Initially) */}
        {showInput && (
          <Box mb={2} mt={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter URL"
              inputProps={{ style: { textAlign: "center" } }}
              sx={{ maxWidth: "300px", fontFamily: "'Roboto', sans-serif" }}
            />
          </Box>
        )}

        {/* Button to Navigate to URL */}
        <Button
          variant="contained"
          onClick={handleNavigate}
          sx={{
            backgroundColor: "#1976d2",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: "bold",
            padding: "10px 20px",
            fontSize: "16px",
            "&:hover": { backgroundColor: "#115293" },
          }}
        >
          Go to Stream
        </Button>
      </Box>
    </Box>
  );
};

export default MjpegStreamLink;
