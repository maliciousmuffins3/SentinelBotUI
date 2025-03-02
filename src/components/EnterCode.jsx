import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import useLocalStorage from "../hooks/useLocalStorage";

const EnterCode = () => {
    const [code, setCode] = useState("");
    const [userCode, setUserCode] = useLocalStorage("userCode", ""); // ✅ Only set, no need to read

    const handleSubmit = () => {
        if (!code.trim()) return; // ✅ Prevent saving empty values
        setUserCode(code);
        console.log("Stored userCode in Local Storage:", code);
        window.location.reload();
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4">Enter Your Code</Typography>
            
            <TextField
                label="Enter Code"
                variant="outlined"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
            />
            
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </Container>
    );
};

export default EnterCode;
