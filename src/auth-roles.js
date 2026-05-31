// Centralizes the UI role policy so redirects, navigation, and admin route guards cannot drift apart.
export const getRoleName = (user) => user?.role?.name || user?.role || "";

export const isAdmin = (user) => getRoleName(user) === "Admin";
export const isAuthor = (user) => getRoleName(user) === "Author";

export const canAccessAdmin = (user) => isAdmin(user) || isAuthor(user);

export const getPostLoginPath = (user) => {
  if (isAdmin(user)) return "/";
  if (isAuthor(user)) return "/posts";
  return "/home";
};
