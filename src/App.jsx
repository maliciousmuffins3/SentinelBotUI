import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db, auth } from "./hooks/firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TuneIcon from "@mui/icons-material/Tune";
import Box from "@mui/material/Box";
import Loading from "./components/Loading";
import MjpegStreamLink from "./components/MjpegStreamLink";
import EnterCode from "./components/EnterCode";
import Home from "./pages/Home";
import NotificationButton from "./components/NotificationButton";
import NotificationComponent from "./pages/NotificationComponent";
import ControlPanel from "./pages/ControlPanel";
import useLocalStorage from "./hooks/useLocalStorage";
import ChartPage from "./pages/ChartPage";


const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [userCode, setUserCode] = useLocalStorage("userCode","");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                signInAnonymously(auth).catch((error) => {
                    console.error("Error signing in anonymously:", error);
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const userCodeRef = ref(db, `users/${user.uid}/code`);
            return onValue(userCodeRef, (snapshot) => {
                if (snapshot.exists()) {
                    setUserCode(snapshot.val());
                }
            });
        }
    }, [user]);

    if (loading) return <Loading />;

    return (
            <Router>
                <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                    {/* 🔵 App Bar (Fixed at the top) */}
                    <AppBar position="fixed" sx={{ width: "100%", zIndex: 1100 }}>
                        <Toolbar>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>Sentinel Bot</Typography>
                            <NotificationButton component={Link} to="/notification" />
                        </Toolbar>
                    </AppBar>

                    {/* 📌 Content Area (Added Margin to Avoid Overlap) */}
                    <Box sx={{ flexGrow: 1, marginTop: "54px", overflowY: "auto" }}>
                        <Switch>
                            <Route path="/notification" component={NotificationComponent} />
                            <Route path="/control_panel" component={ControlPanel} />
                            <Route path="/" exact component={Home} />
                            <Route path="/charts" exact component={ChartPage} />
                        </Switch>
                    </Box>

                    {/* 🔵 Bottom Navigation (Fixed at the Bottom) */}
                    <BottomNavigation
                        sx={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            bgcolor: "background.paper",
                            zIndex: 1000,
                            borderTop: "1px solid #ddd",
                        }}
                        value={value}
                        onChange={(event, newValue) => setValue(newValue)}
                        showLabels
                    >
                        <BottomNavigationAction label="Home" icon={<HomeIcon />} component={Link} to="/" />
                        <BottomNavigationAction label="Sensors" icon={<EqualizerIcon  />} component={Link} to="/charts" />
                        <BottomNavigationAction label="Control" icon={<TuneIcon />} component={Link} to="/control_panel" />
                    </BottomNavigation>
                </Box>
            </Router>
    );
};

export default App;
