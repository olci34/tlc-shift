export function isValidPassword(password: string): boolean {
  if (password.length < 6 || password.length > 18) {
    return false;
  }

  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;

  if (
    !uppercaseRegex.test(password) ||
    !lowercaseRegex.test(password) ||
    !numberRegex.test(password)
  ) {
    return false;
  }

  return true;
}
