import Button from "./Button";
import "./AuthForm.css";
import { useState } from "react";
import { handleErrorLogging } from "../lib/utils";

type AuthFormProps = {
  header: string;
  action: string;
  btnText: string;
};

export default function AuthForm({ header, action, btnText }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3333/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
        );
      }
    } catch (error) {
      handleErrorLogging(error, "Error while registering user");
    }
  };
  return (
    <div id="auth-section">
      <h2>{header}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <Button type="submit" text={btnText} id="submit-btn" />
      </form>
    </div>
  );
}
