import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import VideocamIcon from "@mui/icons-material/Videocam";
import SensorsIcon from "@mui/icons-material/Sensors";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MicIcon from "@mui/icons-material/Mic";
import SecurityIcon from "@mui/icons-material/Security";

// Assuming AppBar is 64px and Bottom Nav is 56px
const appBarHeight = 64;
const bottomNavHeight = 56;

// Custom Styling for the Background Section
const HeroContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  height: `calc(100vh - ${appBarHeight}px - ${bottomNavHeight}px)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  background: "linear-gradient(135deg, #1976d2 30%, #42a5f5 100%)",
  color: "#fff",
  padding: theme.spacing(4),
  overflow: "auto",
}));

export default function Home() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Hero Section */}
      <HeroContainer>
        <Container>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Next-Gen Home Security Robot
          </Typography>

          <Typography variant="h6" gutterBottom>
            AI-powered surveillance and smart automation for 24/7 home protection.
          </Typography>
        </Container>
      </HeroContainer>

      {/* Features Section */}
      <Container sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          🔥 Key Features
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {/* Real-Time Surveillance */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <VideocamIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  Real-Time Surveillance
                </Typography>
                <Typography variant="body2">
                  Captures live video feeds with an AI Thinker OV2640 camera.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Motion Detection */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <SensorsIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  Motion Detection
                </Typography>
                <Typography variant="body2">
                  Identifies unauthorized movements using a PIR motion sensor.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Temperature Monitoring */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <ThermostatIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  Temperature Monitoring
                </Typography>
                <Typography variant="body2">
                  Detects unusual heat levels using a DHT22 sensor.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Auto Navigation */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <DirectionsCarIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  Auto Navigation
                </Typography>
                <Typography variant="body2">
                  Moves and avoids obstacles with ultrasonic scanning.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Sound Detection */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <MicIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  Sound Detection
                </Typography>
                <Typography variant="body2">
                  Captures suspicious noises through a microphone sensor.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Remote Access */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <SecurityIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  Remote Access
                </Typography>
                <Typography variant="body2">
                  Monitor and control the robot anytime via a web dashboard.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Spacer for Navigation */}
      <Box height={`${bottomNavHeight}px`} />
    </Box>
  );
}
