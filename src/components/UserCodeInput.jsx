import React, { useState } from "react";
import { database, ref, set } from "./firebaseConfig";

const UserCodeInput = () => {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    set(ref(database, "/codes/user1"), code); // Save user's code
    alert("Code submitted!");
  };

  return (
    <div>
      <h2>Enter Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserCodeInput;
