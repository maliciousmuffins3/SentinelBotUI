import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { IconButton, Badge, Tooltip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled, keyframes } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 🔥 Bounce Animation
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

// 🎨 Styled Icon Button
const StyledIconButton = styled(IconButton)(({ ownerState }) => ({
  transition: "0.3s ease-in-out",
  color: ownerState.hasNotif ? "#FFD700" : "inherit", // 🟡 Turns Gold on New Notification
  animation: ownerState.hasNotif ? `${bounce} 1s` : "none",
}));

// 🔔 Custom Small Bell Icon
const SmallBellIcon = styled(NotificationsIcon)({
  fontSize: "26px",
});

const NotificationButton = () => {
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [user, setUser ] = useState(null);
  const auth = getAuth();
  const db = getDatabase();

  // ✅ Listen for Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      if (currentUser ) {
        setUser (currentUser );
      } else {
        setUser (null);
        setTotalNotifications(0); // Reset notifications if user logs out
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // ✅ Listen for Notifications in Firebase
  useEffect(() => {
    if (!user) return; // Exit if no user is logged in

    const userCode = user.uid;
    const notifRef = ref(db, `/notifications/${userCode}`);

    const notifListener = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const notifications = snapshot.val();
        const totalCount = Object.keys(notifications).length; // Count total notifications
        setTotalNotifications(totalCount);
      } else {
        setTotalNotifications(0); // No notifications
      }
    });

    return () => off(notifRef);
  }, [user, db]);

  // ✅ Reset unread count when clicking the bell
  const handleClick = () => {
    // Optionally, you can mark notifications as read here if needed
    // For example, you could update the database to set all notifications to read
  };

  return (
    <Tooltip title={`You have ${totalNotifications} notifications`}>
      <StyledIconButton
        component={Link}
        to="/notification"
        onClick={handleClick}
        ownerState={{ hasNotif: totalNotifications > 0 }}
      >
        <Badge badgeContent={totalNotifications} color="error">
          <SmallBellIcon />
        </Badge>
      </StyledIconButton>
    </Tooltip>
  );
};

export default NotificationButton;