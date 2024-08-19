export default function RegisterPage() {
  return (
    <>
     <h1>Register</h1>
     <form action="/register" method="post">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <button type="submit">Register</button>
      </form>
    </>
  );
}