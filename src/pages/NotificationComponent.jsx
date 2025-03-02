import React, { useState, useEffect } from "react";
import { getDatabase, ref, onChildAdded, onValue, off, get } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { Typography, Box, Button } from "@mui/material";

const NotificationComponent = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser ] = useState(null);
  const auth = getAuth();
  const db = getDatabase();

  // Handle Anonymous Sign-In
  const handleAnonymousSignIn = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      setUser (userCredential.user);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      setUser (currentUser );
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [auth]);

  useEffect(() => {
    if (!user) {
      console.log("No user found, stopping Firebase listener.");
      return;
    }

    const userCode = user.uid;
    const notifRef = ref(db, `/notifications/${userCode}`);
    const tempRef = ref(db, "/sensors/temperature");
    const motionRef = ref(db, "/sensors/motionDetected");
    const noiseRef = ref(db, "/sensors/soundLevel");

    const sendNotification = (message) => {
      const timestamp = new Date().toLocaleString();
      setMessages((prev) => [{ text: message, time: timestamp }, ...prev]);
    };

    // Fetch previous notifications
    const fetchPreviousNotifications = async () => {
      const snapshot = await get(notifRef);
      if (snapshot.exists()) {
        const notifications = snapshot.val();
        const notificationsArray = Object.values(notifications).map((msg) => ({
          text: msg,
          time: new Date().toLocaleString(), // You might want to store the actual timestamp if available
        }));
        setMessages((prev) => [...notificationsArray, ...prev]);
      }
    };

    fetchPreviousNotifications();

    // ✅ Real-time Notification Listener (Reacts to NEW notifications only)
    const notifListener = onChildAdded(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("📩 New Notification:", snapshot.val());
        sendNotification(snapshot.val());
      }
    });

    // ✅ Motion Detection Listener 🚨
    const motionListener = onValue(motionRef, (motionSnap) => {
      if (motionSnap.exists() && motionSnap.val()) {
        console.log("🚨 Motion Detected!");
        sendNotification("🚨 Motion Detected!");

        // ✅ Check temperature only once when motion is detected
        get(tempRef).then((tempSnap) => {
          if (tempSnap.exists()) {
            const temperature = tempSnap.val();
            console.log("🌡 Temperature:", temperature);
            if (temperature >= 50) {
              sendNotification("🔥 Fire Alert! High Temperature Detected!");
            }
          }
        });
      }
    });

    // ✅ Noise Detection Listener 🔊
    const noiseListener = onValue(noiseRef, (noiseSnap) => {
      if (noiseSnap.exists()) {
        const noiseLevel = noiseSnap.val();
        console.log("🔊 Noise Level:", noiseLevel);
        if (noiseLevel >= 30) {
          sendNotification("⚠️ Loud Noise Detected! Possible Unusual Activity!");
        }
      }
    });

    // ✅ Cleanup listeners on unmount
    return () => {
      off(notifRef);
      off(motionRef);
      off(tempRef);
      off(noiseRef);
    };
  }, [user, db]);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 2, p: 2, mb: 5, fontFamily: "Roboto, sans-serif" }}>
      {/* Sign In Button */}
      {!user && (
        <Button variant="contained" onClick={handleAnonymousSignIn}>
          Sign in Anonymously
        </Button>
      )}

      {/* 📜 Notifications */}
      <Box mt={2}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Box
              key={index}
              p={2}
              bgcolor="#e0e0e0"
              borderRadius="8px"
              boxShadow="0px 4px 6px rgba(0,0,0,0.1)"
              sx={{ mb: 2, fontSize: "0.95rem" }}
            >
              {msg.text} <br />
              <Typography variant="caption" color="gray">
                {msg.time}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography
            variant="body1"
            color="gray"
            sx={{ fontSize: "0.95rem", textAlign: "center", mt: 2 }}
          >
            No previous notifications
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default NotificationComponent;