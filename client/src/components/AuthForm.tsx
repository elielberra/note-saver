import Button from "./Button";
import "./AuthForm.css";

type AuthFormProps = {
  header: string;
  btnText: string;
}

export default function AuthForm({header, btnText}: AuthFormProps) {
  return (
    <div id="auth-section">
      <h2>{header}</h2>
      <form action="/register" method="post">
        <label htmlFor="username">Username:</label>
        <input type="text" name="username"required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <Button type="submit" text={btnText} id="submit-btn" />
      </form>
    </div>
  );
}
