import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from '@mui/icons-material/Home';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import TuneIcon from '@mui/icons-material/Tune';
import Popover from "@mui/material/Popover";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const View = ({ initialNotifications = [] }) => {
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [unreadCount, setUnreadCount] = useState(initialNotifications.length);

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
        setUnreadCount(0); // Clear the badge count when clicked
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "notification-popover" : undefined;

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        My App
                    </Typography>
                    {/* Notification Button with Badge */}
                    <IconButton color="inherit" onClick={handleNotificationClick}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    {/* Popover for Notifications */}
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <List>
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <ListItem button key={index}>
                                        <ListItemText primary={notification} />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No new notifications" />
                                </ListItem>
                            )}
                        </List>
                    </Popover>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {/* Directly include the component you want to render here */}
            <div>
                {/* Example component */}
                <h2>Welcome to the Home Page</h2>
                <p>This is a custom component rendered directly within the View component.</p>
            </div>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Camera" icon={<VideoCameraBackIcon />} />
                <BottomNavigationAction label="Settings" icon={<TuneIcon />} />
            </BottomNavigation>
        </div>
    );
};

export default View;
