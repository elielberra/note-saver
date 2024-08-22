import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleErrorLogging } from "../lib/utils";
import { ResigterUserResponse } from "../types/types";
import Button from "./Button";
import "./AuthForm.css";

type AuthFormProps = {
  header: string;
  action: string;
  btnText: string;
};

export default function AuthForm({ header, action, btnText }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3333/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include" // evaluate if it is really needed.
      });
      const responseBody: ResigterUserResponse = await response.json();
      if (response.status === 409 && "message" in responseBody) {
        setError(responseBody.message);
      } else if (!response.ok) {
        throw new Error(
          `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
        );
      } else {
        error && setError(null);
        const response = await fetch(`http://localhost:3333/isauthenticated`, {
          method: "GET",
          credentials: "include",
          mode: "cors"
        });

        console.log("responseBody", responseBody);
        navigate("/");
        const resData = await response.json();
        console.log("resData", resData);

      }
    } catch (error) {
      handleErrorLogging(error, "Error while registering user");
    }
  };
  return (
    <div id="auth-section">
      <h2>{header}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p id="error-txt">{error}</p>}
        <label htmlFor="username" className="auth-label">
          Username:
        </label>
        <input
          type="text"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          maxLength={30}
          className="auth-input"
        />
        <br />
        <label htmlFor="password" className="auth-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          maxLength={30}
          className="auth-input"
        />
        <br />
        <Button type="submit" text={btnText} id="submit-btn" />
      </form>
    </div>
  );
}
