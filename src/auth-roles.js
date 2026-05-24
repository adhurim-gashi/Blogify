// Centralizes the UI role policy so redirects, navigation, and admin route guards cannot drift apart.
export const getRoleName = (user) => user?.role?.name || user?.role || "";

export const canAccessAdmin = (user) => ["Admin", "Author"].includes(getRoleName(user));

export const getPostLoginPath = (user) => (canAccessAdmin(user) ? "/" : "/home");
