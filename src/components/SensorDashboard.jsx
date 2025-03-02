import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState({
    humidity: [],
    mic: [],
    pir: [],
    timestamps: [],
  });

  useEffect(() => {
    const db = getDatabase();
    const sensorRef = ref(db, "/sensorData");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newHumidity = [];
        const newMic = [];
        const newPir = [];
        const newTimestamps = [];

        Object.entries(data).forEach(([timestamp, values]) => {
          newHumidity.push(values.humidity || 0);
          newMic.push(values.mic || 0);
          newPir.push(values.pir || 0);
          newTimestamps.push(new Date(parseInt(timestamp)).toLocaleTimeString());
        });

        setSensorData({
          humidity: newHumidity,
          mic: newMic,
          pir: newPir,
          timestamps: newTimestamps,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Chart Data Configuration
  const chartData = {
    labels: sensorData.timestamps,
    datasets: [
      {
        label: "Humidity (%)",
        data: sensorData.humidity,
        borderColor: "#3f51b5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Microphone (dB)",
        data: sensorData.mic,
        borderColor: "#f50057",
        backgroundColor: "rgba(245, 0, 87, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "PIR Motion",
        data: sensorData.pir,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <Card sx={{ width: "100%", maxWidth: 700, margin: "auto", mt: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Sensor Data Chart
        </Typography>
        <Box sx={{ height: 300 }}>
          <Line data={chartData} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SensorDashboard;
