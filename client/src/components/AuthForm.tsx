import { useState } from "react";
import { getHeadersWithContentType, handleErrorInResponse, handleLogging } from "../lib/utils";
import {
  AuthenticateUserResponse,
  SuccessfulAuthResponse,
  UnsuccessfulAuthResponse
} from "../types/types";
import Button from "./Button";
import "./AuthForm.css";
import { useUserContext } from "./UserContext";
import { useConfig } from "./ConfigContext";

type AuthFormProps = {
  header: string;
  action: "signin" | "signup";
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
  const config = useConfig();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useUserContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`${config.SERVER_URL}/${action}`, {
        method: "POST",
        headers: getHeadersWithContentType(),
        body: JSON.stringify({ username, password })
      });
      const responseBody: AuthenticateUserResponse = await response.json();
      if (response.status === 400 || response.status === 401 || response.status === 409) {
        isUnsuccessfulResponse(responseBody) && setError(responseBody.message);
      } else if (!response.ok) {
        isUnsuccessfulResponse(responseBody) && handleErrorInResponse(config.SERVER_URL, response, responseBody);
        return;
      }
      error && setError(null);
      if (isSuccessfulResponse(responseBody)) {
        sessionStorage.setItem("authToken", responseBody.authToken);
        login(responseBody.username);
      }
    } catch (error) {
      handleLogging(
        config.SERVER_URL,
        "error",
        `Error while ${action == "signin" ? "signing in" : "signing up"} the user`,
        error
      );
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
      {action === "signin" && (
        <p id="go-to-signup">
          Are you not registered? Go to <a href="/signup">Sign Up</a>
        </p>
      )}
    </div>
  );
}
