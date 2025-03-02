import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Divider, Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getDatabase, ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";

// ✅ Register chart.js components
Chart.register(...registerables);

const ChartDisplay = () => {
  const [humidityData, setHumidityData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [micData, setMicData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [pirData, setPirData] = useState({ labels: [], datasets: [{ data: [] }] });

  useEffect(() => {
    const db = getDatabase();

    // 📌 Function to fetch data
    const fetchData = (sensorPath, setData) => {
      const sensorRef = ref(db, sensorPath);
      return onValue(sensorRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const labels = Object.keys(data);
          const values = Object.values(data);
          setData({
            labels: labels.slice(-10), // Show last 10 data points
            datasets: [
              {
                label: sensorPath.split("/").pop(), // Get sensor name from path
                data: values.slice(-10),
                borderColor: "#4FC3F7",
                backgroundColor: "rgba(79, 195, 247, 0.2)",
                borderWidth: 2,
              },
            ],
          });
        }
      });
    };

    // 🔥 Fetch humidity, mic, and PIR data
    const unsubHumidity = fetchData("sensorData/humidity", setHumidityData);
    const unsubMic = fetchData("sensorData/mic", setMicData);
    const unsubPir = fetchData("sensorData/pir", setPirData);

    return () => {
      unsubHumidity();
      unsubMic();
      unsubPir();
    };
  }, []);

  // 🎨 Styled Chart Wrapper
  const ChartCard = ({ title, data }) => (
    <Paper
      elevation={4}
      sx={{
        width: "90vw",
        maxWidth: "500px",
        backgroundColor: "#2A3C4F", // Dark theme
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: "white", fontWeight: "bold", marginBottom: "15px" }}
      >
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: "250px" }}>
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.2)" } },
              y: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.2)" } },
            },
          }}
        />
      </Box>
    </Paper>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={4}
      sx={{ padding: "20px" }}
    >
      {/* 📊 Humidity Chart */}
      <ChartCard title="Humidity Levels" data={humidityData} />

      <Divider sx={{ width: "80%", backgroundColor: "rgba(255,255,255,0.2)" }} />

      {/* 🎤 MIC Chart */}
      <ChartCard title="Microphone Levels" data={micData} />

      <Divider sx={{ width: "80%", backgroundColor: "rgba(255,255,255,0.2)" }} />

      {/* 🏃 PIR Motion Chart */}
      <ChartCard title="PIR Motion Detection" data={pirData} />

      {/* 🔙 Back Button */}
      <Button
        component={Link}
        to="/"
        variant="contained"
        sx={{
          backgroundColor: "#2A3C4F",
          color: "white",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "8px",
          fontWeight: "bold",
          textDecoration: "none",
          "&:hover": { backgroundColor: "#3B4D61" },
        }}
      >
        🔙 Back to Control Panel
      </Button>
    </Box>
  );
};

export default ChartDisplay;
