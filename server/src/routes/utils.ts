import bcrypt from "bcrypt";

export async function checkIfPasswordIsValid(enteredPassword: string, userPassword: string) {
  return await bcrypt.compare(enteredPassword, userPassword);
}
