const { PERMISSIONS, Admin } = require("../models/admin.model");

const hasPermission = (permissions) => {
    return async (req, res, next) => {
        try {
            const userId = req.payload.aud;
            if (!userId) return res.status(403).json({ message: 'No userId found in token' });

            const admin = await Admin.findById(userId);
            if (!admin) return res.status(400).json({ message: 'Admin not found' });

            const { permissions: adminPermissions } = admin;
            if (!adminPermissions) return res.status(403).json({ message: 'No permissions found for admin' });

            // Bỏ qua kiểm tra nếu quyền truyền vào là 'all' hoặc admin có quyền 'admin'
            if (permissions.includes('all') || adminPermissions.includes(PERMISSIONS.ADMIN)) {
                return next();
            }

            const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

            const hasPermission = requiredPermissions.some(permission => adminPermissions.includes(permission));

            if (!hasPermission) {
                return res.status(403).json({ message: `You do not have permission to perform this action` });
            }

            next(); // Tiếp tục nếu có quyền
        } catch (error) {
            return res.status(500).json({ message: `Authorization failed: ${error.message}` });
        }
    };
};

module.exports = { hasPermission };
