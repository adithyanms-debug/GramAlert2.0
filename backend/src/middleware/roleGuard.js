export const requireRole = (roleArray) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized: User role not found' });
        }

        if (!roleArray.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }

        next();
    };
};

export const isAdmin = requireRole(['ADMIN', 'SUPERADMIN']);
export const isSuperAdmin = requireRole(['SUPERADMIN']);
export const isVillager = requireRole(['VILLAGER', 'ADMIN', 'SUPERADMIN']); 
