const UserModel = require('../dao/models/user-mongoose');
const logger = require('../config/logger');

exports.changeUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params;

        const user = await UserModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        logger.info(`Rol de usuario con ID ${uid} cambiado a ${user.role}`);
        res.status(200).json({ message: `Rol cambiado a ${user.role}`, user });
    } catch (error) {
        logger.error('Error al cambiar el rol del usuario:', error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};
