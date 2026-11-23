const STAFF_ROLES = [
  "super_admin",
  "admin",
  "staff",
  "finance",
  "programs",
  "volunteers",
  "communications",
];

export function getAuthenticatedDestination(roles = []) {
  const normalizedRoles = Array.isArray(roles) ? roles : [];
  return normalizedRoles.some((role) => STAFF_ROLES.includes(role))
    ? "/admin"
    : normalizedRoles.includes("public_user")
      ? "/account"
      : "/admin";
}

/**
 * Shared Google sign-in action for account access and the site header.
 * AuthProvider handles redirect-based sign-in when login returns null.
 */
export async function continueWithGoogle({ login, navigate }) {
  if (typeof login !== "function") {
    throw new Error("Google sign-in is not available right now.");
  }

  const signedInUser = await login();
  if (signedInUser) {
    navigate?.(
      getAuthenticatedDestination(signedInUser.roles)
    );
  }
  return signedInUser;
}
