import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Grid,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { getDatabase, ref, onValue, update } from "firebase/database";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const db = getDatabase();

const ControlPanel = () => {
  const [activeButtons, setActiveButtons] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const [cameraIP, setCameraIP] = useState("");
  const [imageKey, setImageKey] = useState(Date.now());
  const [isStationary, setIsStationary] = useState(true);

  // Fetch Camera IP from Firebase
  useEffect(() => {
    const ipRef = ref(db, "camera/ip");
    onValue(ipRef, (snapshot) => {
      const ip = snapshot.val();
      if (ip) {
        setCameraIP(`http://${ip}/mjpeg/1`);
      }
    });
  }, []);

  // Listen for Stationary Toggle in Firebase
  useEffect(() => {
    const stationaryRef = ref(db, "controls/stationary");
    onValue(stationaryRef, (snapshot) => {
      const value = snapshot.val();
      setIsStationary(value === 0); // FIX: Firebase 1 = Stationary, 0 = Active
    });
  }, []);

  // Refresh the camera feed every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(Date.now());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update control states in Firebase
  const updateDirection = (direction, value) => {
    if (isStationary) return;

    const newState = { ...activeButtons, [direction]: value };
    setActiveButtons(newState);

    update(ref(db, "controls"), {
      top: newState.top ? 1 : 0,
      bottom: newState.bottom ? 1 : 0,
      left: newState.left ? 1 : 0,
      right: newState.right ? 1 : 0,
    });
  };

  // Handle button press and release
  const handlePress = (direction) => () => updateDirection(direction, true);
  const handleRelease = (direction) => () => updateDirection(direction, false);

  // Handle WASD keyboard controls
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
          updateDirection("top", true);
          break;
        case "a":
          updateDirection("left", true);
          break;
        case "s":
          updateDirection("bottom", true);
          break;
        case "d":
          updateDirection("right", true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
          updateDirection("top", false);
          break;
        case "a":
          updateDirection("left", false);
          break;
        case "s":
          updateDirection("bottom", false);
          break;
        case "d":
          updateDirection("right", false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isStationary]);

  // Toggle control state
  const handleToggle = () => {
    const newState = !isStationary; // Toggle local state
    setIsStationary(newState);
  
    update(ref(db, "controls"), { stationary: newState ? 1 : 0 }); // 1 = Stationary, 0 = Active
  };
  
  useEffect(() => {
    const stationaryRef = ref(db, "controls/stationary");
    onValue(stationaryRef, (snapshot) => {
      const value = snapshot.val();
      setIsStationary(value === 1); // Ensure state matches Firebase
    });
  }, []);
  
  
  

  return (
    <Stack
      alignItems="center"
      spacing={3}
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 3 },
        bgcolor: "#1E2A38",
      }}
    >
      {/* Camera View */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#2A3C4F",
          padding: "12px",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#000",
          }}
        >
          {cameraIP ? (
            <img
              key={imageKey}
              src={cameraIP}
              alt="Camera View"
              onError={() => setImageKey(Date.now())}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Typography color="white">Loading Camera...</Typography>
          )}
        </Box>
      </Paper>

      {/* Stationary Toggle */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#2A3C4F",
          padding: "15px",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={!isStationary} // FIX: Correct UI state
              onChange={handleToggle}
              color="primary"
            />
          }
          label={
            <Typography color="white" fontSize="18px">
              {isStationary ? "Stationary" : "Active"}
            </Typography>
          }
        />
      </Paper>

      {/* Control Panel (Restored) */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#2A3C4F",
          padding: "15px",
          borderRadius: "12px",
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={4} />
          <Grid item xs={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color={activeButtons.top ? "secondary" : "primary"}
              onMouseDown={handlePress("top")}
              onMouseUp={handleRelease("top")}
              disabled={isStationary}
            >
              <ArrowUpwardIcon fontSize="large" />
            </Button>
          </Grid>
          <Grid item xs={4} />

          <Grid item xs={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color={activeButtons.left ? "secondary" : "primary"}
              onMouseDown={handlePress("left")}
              onMouseUp={handleRelease("left")}
              disabled={isStationary}
            >
              <ArrowBackIcon fontSize="large" />
            </Button>
          </Grid>

          <Grid item xs={4} />

          <Grid item xs={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color={activeButtons.right ? "secondary" : "primary"}
              onMouseDown={handlePress("right")}
              onMouseUp={handleRelease("right")}
              disabled={isStationary}
            >
              <ArrowForwardIcon fontSize="large" />
            </Button>
          </Grid>

          <Grid item xs={4} />
          <Grid item xs={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color={activeButtons.bottom ? "secondary" : "primary"}
              onMouseDown={handlePress("bottom")}
              onMouseUp={handleRelease("bottom")}
              disabled={isStationary}
            >
              <ArrowDownwardIcon fontSize="large" />
            </Button>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </Paper>
    </Stack>
  );
};

export default ControlPanel;
