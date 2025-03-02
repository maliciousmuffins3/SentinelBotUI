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
const isMobileOrTablet = window.matchMedia("(pointer: coarse)").matches; // Detect mobile & tablet

const ControlPanel = () => {
  const [activeButtons, setActiveButtons] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const [cameraIP, setCameraIP] = useState("");
  const [imageKey, setImageKey] = useState(Date.now());
  const [isStationary, setIsStationary] = useState(1); // Default to 1 (Stationary)

  // Fetch Camera IP
  useEffect(() => {
    const ipRef = ref(db, "camera/ip");
    onValue(ipRef, (snapshot) => {
      const ip = snapshot.val();
      if (ip) {
        setCameraIP(`http://${ip}/mjpeg/1`);
      }
    });
  }, []);

  // Listen for Stationary Toggle
  useEffect(() => {
    const stationaryRef = ref(db, "controls/stationary");
    onValue(stationaryRef, (snapshot) => {
      setIsStationary(snapshot.val());
    });
  }, []);

  // Refresh camera feed every 5 sec
  useEffect(() => {
    const interval = setInterval(() => setImageKey(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Controls (WASD)
  useEffect(() => {
    const keyMap = { w: "top", s: "bottom", a: "left", d: "right" };

    const handleKeyDown = (event) => {
      if (isStationary || !keyMap[event.key.toLowerCase()]) return;
      updateDirection(keyMap[event.key.toLowerCase()], 1);
    };

    const handleKeyUp = (event) => {
      if (!keyMap[event.key.toLowerCase()]) return;
      updateDirection(keyMap[event.key.toLowerCase()], 0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isStationary]);

  // ✅ Properly updates Firebase and state (1 and 0 instead of true/false)
  const updateDirection = (direction, value) => {
    if (isStationary) return;
    setActiveButtons((prevState) => {
      const newState = { ...prevState, [direction]: value };
      update(ref(db, "controls"), newState);
      return newState;
    });
  };

  // ✅ Mobile & Tablet: Tap toggles between 1 and 0
  const handleTap = (direction) => () => {
    if (!isMobileOrTablet) return;
    setActiveButtons((prevState) => {
      const newValue = prevState[direction] === 1 ? 0 : 1; // Toggle 1 and 0
      const newState = { ...prevState, [direction]: newValue };
      update(ref(db, "controls"), newState);
      return newState;
    });
  };

  // ✅ Desktop: Press to send 1, release to send 0
  const handlePress = (direction) => (event) => {
    event.preventDefault();
    if (isMobileOrTablet) return;
    updateDirection(direction, 1);
  };

  const handleRelease = (direction) => (event) => {
    event.preventDefault();
    if (isMobileOrTablet) return;
    updateDirection(direction, 0);
  };

  // ✅ Toggle stationary mode (1 = Stationary, 0 = Active)
  const handleToggle = () => {
    const newState = isStationary === 1 ? 0 : 1;
    setIsStationary(newState);
    update(ref(db, "controls"), { stationary: newState });
  };

  return (
    <Stack alignItems="center" spacing={3} sx={{ minHeight: "100vh", p: { xs: 2, md: 3 }, bgcolor: "#1E2A38" }}>
      {/* Camera View */}
      <Paper elevation={4} sx={{ width: "100%", maxWidth: "600px", backgroundColor: "#2A3C4F", padding: "12px", borderRadius: "12px" }}>
        <Box sx={{ width: "100%", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#000" }}>
          {cameraIP ? <img key={imageKey} src={cameraIP} alt="Camera View" onError={() => setImageKey(Date.now())} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Typography color="white">Loading Camera...</Typography>}
        </Box>
      </Paper>

      {/* Stationary Toggle */}
      <Paper elevation={4} sx={{ width: "100%", maxWidth: "400px", backgroundColor: "#2A3C4F", padding: "15px", borderRadius: "12px" }}>
        <FormControlLabel control={<Switch checked={isStationary === 0} onChange={handleToggle} color="primary" />} label={<Typography color="white" fontSize="18px">{isStationary ? "Stationary" : "Active"}</Typography>} />
      </Paper>

      {/* Control Buttons */}
      <Paper elevation={4} sx={{ width: "100%", maxWidth: "400px", backgroundColor: "#2A3C4F", padding: "15px", borderRadius: "12px" }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={4} />
          <Grid item xs={4} display="flex" justifyContent="center">
            <Button variant="contained" color={activeButtons.top ? "secondary" : "primary"} onMouseDown={handlePress("top")} onMouseUp={handleRelease("top")} onTouchStart={handleTap("top")} disabled={isStationary === 1}>
              <ArrowUpwardIcon fontSize="large" />
            </Button>
          </Grid>
          <Grid item xs={4} />

          <Grid item xs={4} display="flex" justifyContent="center">
            <Button variant="contained" color={activeButtons.left ? "secondary" : "primary"} onMouseDown={handlePress("left")} onMouseUp={handleRelease("left")} onTouchStart={handleTap("left")} disabled={isStationary === 1}>
              <ArrowBackIcon fontSize="large" />
            </Button>
          </Grid>

          <Grid item xs={4} />

          <Grid item xs={4} display="flex" justifyContent="center">
            <Button variant="contained" color={activeButtons.right ? "secondary" : "primary"} onMouseDown={handlePress("right")} onMouseUp={handleRelease("right")} onTouchStart={handleTap("right")} disabled={isStationary === 1}>
              <ArrowForwardIcon fontSize="large" />
            </Button>
          </Grid>

          <Grid item xs={4} />
          <Grid item xs={4} display="flex" justifyContent="center">
            <Button variant="contained" color={activeButtons.bottom ? "secondary" : "primary"} onMouseDown={handlePress("bottom")} onMouseUp={handleRelease("bottom")} onTouchStart={handleTap("bottom")} disabled={isStationary === 1}>
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
