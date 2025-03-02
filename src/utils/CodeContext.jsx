import React, { createContext, useState, useContext } from "react";

// ✅ Create Context
const CodeContext = createContext();

// ✅ Provider Component
export const CodeProvider = ({ children }) => {
    const [userCode, setUserCode] = useState(""); // Only storing userCode

    return (
        <CodeContext.Provider value={{ userCode, setUserCode }}>
            {children}
        </CodeContext.Provider>
    );
};

// ✅ Custom Hook (For easy access)
export const useCode = () => useContext(CodeContext);
