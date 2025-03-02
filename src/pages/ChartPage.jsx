import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Function to create initial chart data
const createInitialChartData = (label) => ({
  labels: [],
  datasets: [
    {
      label: label,
      data: [],
      borderColor: "#007BFF",
      backgroundColor: "rgba(0, 123, 255, 0.2)",
      tension: 0,
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: "#007BFF",
    },
  ],
});

// Function to format time in Philippine Time (PHT, UTC+8)
const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const ChartPage = () => {
  const [humidityData, setHumidityData] = useState(createInitialChartData("Humidity"));
  const [soundData, setSoundData] = useState(createInitialChartData("Sound Level"));
  const [temperatureData, setTemperatureData] = useState(createInitialChartData("Temperature"));

  // State for Motion and Noise as status UI
  const [motionDetected, setMotionDetected] = useState(null);
  const [noiseDetected, setNoiseDetected] = useState(null);
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(null);

  useEffect(() => {
    const db = getDatabase();

    // Function to update chart data dynamically
    const updateChart = (dataRef, setChartData, setCurrentValue) => {
      onValue(dataRef, (snapshot) => {
        const newValue = snapshot.val();
        if (newValue !== null) {
          setCurrentValue(newValue);

          setChartData((prev) => {
            const newLabels = [...prev.labels, formatTime()];
            const newValues = [...prev.datasets[0].data, newValue];

            if (newLabels.length > 6) {
              newLabels.shift();
              newValues.shift();
            }

            return {
              labels: newLabels,
              datasets: [{ ...prev.datasets[0], data: newValues }],
            };
          });
        }
      });
    };

    // Function to update motion & noise detected
    const updateStatus = (dataRef, setState) => {
      onValue(dataRef, (snapshot) => {
        setState(snapshot.val());
      });
    };

    // Firebase references
    const humidityRef = ref(db, "/sensors/humidity");
    const motionRef = ref(db, "/sensors/motionDetected");
    const soundRef = ref(db, "/sensors/soundLevel");
    const noiseRef = ref(db, "/sensors/noiseDetected");
    const temperatureRef = ref(db, "/sensors/temperature");

    // Fetch data every 10 seconds
    const interval = setInterval(() => {
      updateChart(humidityRef, setHumidityData, setCurrentHumidity);
      updateChart(soundRef, setSoundData, setCurrentSound);
      updateChart(temperatureRef, setTemperatureData, setCurrentTemperature);
      updateStatus(motionRef, setMotionDetected);
      updateStatus(noiseRef, setNoiseDetected);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", fontFamily: "Roboto, sans-serif", mt: 5, mb: 10 }}>
      {/* Title */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          mb: 5,
          fontWeight: "bold",
          background: "linear-gradient(90deg, #007BFF, #00CFFF)", // Blue gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", // Gradient text effect
          textShadow: "2px 2px 5px rgba(0,0,0,0.3)", // Adds a soft shadow for better visibility
        }}
      >
        🚀 Real-Time Sensor Data
      </Typography>

      {/* Motion & Noise Status Cards */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 5 }}>
        {/* Motion Detected */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              textAlign: "center",
              background: motionDetected ? "#FF3D00" : "#4CAF50",
              color: "#fff",
            }}
          >
            <Typography variant="h6">Motion</Typography>
            <Typography variant="h5">{motionDetected ? "🚨 YES" : "✅ NO"}</Typography>
          </Paper>
        </Grid>

        {/* Noise Detected */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              textAlign: "center",
              background: noiseDetected ? "#FF9800" : "#4CAF50",
              color: "#fff",
            }}
          >
            <Typography variant="h6">Noise</Typography>
            <Typography variant="h5">{noiseDetected ? "🔊 YES" : "✅ NO"}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Humidity Chart */}
      <Box sx={{ backgroundColor: "#fff", padding: 2, borderRadius: 2, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Humidity: {currentHumidity !== null ? `${currentHumidity}%` : "Loading..."}
        </Typography>
        <Box sx={{ width: "100%", height: "auto" }}>
          <Line data={humidityData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
      </Box>

      {/* Sound Level Chart */}
      <Box sx={{ backgroundColor: "#fff", padding: 2, borderRadius: 2, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sound Level: {currentSound !== null ? currentSound : "Loading..."}
        </Typography>
        <Box sx={{ width: "100%", height: "auto" }}>
          <Line data={soundData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
      </Box>

      {/* Temperature Chart */}
      <Box sx={{ backgroundColor: "#fff", padding: 2, borderRadius: 2, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Temperature: {currentTemperature !== null ? `${currentTemperature}°C` : "Loading..."}
        </Typography>
        <Box sx={{ width: "100%", height: "auto" }}>
          <Line data={temperatureData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
      </Box>
    </Container>
  );
};

export default ChartPage;
