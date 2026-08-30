/** Demo-only gate — no NextAuth / no real backend. */
export const DEMO_AUTH_COOKIE = "mr-demo-admin";

export const DEMO_LOGIN = {
  email: "admin@mrmobilezone.com",
  password: "Admin@12345",
  name: "Super Admin",
};

export function isDemoLogin(email: string, password: string) {
  return (
    email.toLowerCase().trim() === DEMO_LOGIN.email &&
    password === DEMO_LOGIN.password
  );
}

export function demoAuthCookieValue() {
  return "1";
}
