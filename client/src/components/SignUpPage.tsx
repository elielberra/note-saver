import Button from "./Button";
import "./SignUpPage.css";

export default function SignUpPage() {
  return (
    <div id="sign-up-section">
      <h2>Sign Up</h2>
      <form action="/register" method="post">
        <label htmlFor="username">Username:</label>
        <input type="text" name="username"required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <Button type="submit" text="Register" id="submit-btn" />
      </form>
    </div>
  );
}
