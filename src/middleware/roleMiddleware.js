export const hasPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) {
      return res.status(403).json({ message: "Role not found" });
    }

    // Admin shortcut: '*' means full access
    if (userRole.permissions.includes("*")) {
      return next();
    }

    if (!userRole.permissions.includes(permission)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
