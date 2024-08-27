import { useState } from "react";
import { handleErrorLogging } from "../lib/utils";
import {
  AuthenticateUserResponse,
  SuccessfulAuthResponse,
  UnsuccessfulAuthResponse
} from "../types/types";
import Button from "./Button";
import "./AuthForm.css";
import { useUserContext } from "./UserContext";

type AuthFormProps = {
  header: string;
  action: string;
  btnText: string;
};

function isSuccessfulResponse(
  response: AuthenticateUserResponse
): response is SuccessfulAuthResponse {
  return (response as SuccessfulAuthResponse).username !== undefined;
}

function isUnsuccessfulResponse(
  response: AuthenticateUserResponse
): response is UnsuccessfulAuthResponse {
  return (response as UnsuccessfulAuthResponse).message !== undefined;
}

export default function AuthForm({ header, action, btnText }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useUserContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3333/${action}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      const responseBody: AuthenticateUserResponse = await response.json();
      if (response.status === 400 || response.status === 401 || response.status === 409) {
        isUnsuccessfulResponse(responseBody) && setError(responseBody.message);
      } else if (!response.ok) {
        throw new Error(
          `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
        );
      } else {
        error && setError(null);
        isSuccessfulResponse(responseBody) && login(responseBody.username);
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
