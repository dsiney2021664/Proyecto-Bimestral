export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Se quiere verificar un role sin validar el token primero'
            });
        }

        const userRole = req.user.role || "CLIENT_ROLE";
        
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Usuario no autorizado, posee un role ${req.user.role}, los roles autorizados son ${roles}`
            });
        }
        next();
    };
};