const UserModel = require('../dao/models/user-mongoose');
const logger = require('../config/logger');
const path = require('path');

exports.changeUserRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await UserModel.findById(uid);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (user.role === 'premium') {
      user.role = 'user';
      await user.save();
      return res.status(200).json({ message: 'Rol de usuario revertido a user.' });
    } else {
      const requiredDocuments = ['id', 'domicilio', 'cuenta'];
      const uploadedDocuments = user.documents.map(doc => doc.name);

      const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments.includes(doc));

      if (missingDocuments.length > 0) {
        return res.status(400).json({ message: 'El usuario no ha subido todos los documentos necesarios.', missingDocuments });
      }

      user.role = 'premium';
      await user.save();

      res.status(200).json({ message: 'Rol de usuario actualizado a premium.' });
    }
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};


  exports.uploadDocuments = async (req, res) => {
    try {
      const { uid } = req.params;
      const files = req.files;
  
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No se han subido archivos.' });
      }
  
      const documents = files.map(file => {
        const baseName = path.basename(file.originalname, path.extname(file.originalname));
        const relativePath = file.path.replace(/^.*uploads\//, 'uploads/');
        return {
          name: baseName,
          reference: relativePath
        };
      });
  
      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      user.documents.push(...documents);
      await user.save();
  
      res.status(200).json({ message: 'Documentos subidos exitosamente.', documents: user.documents });
    } catch (error) {
      console.error('Error al subir documentos:', error);
      res.status(500).json({ message: 'Error interno del servidor', error });
    }
  };