// src/services/cloudinaryService.js

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Sube una imagen a Cloudinary
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise<string>} - URL de la imagen subida
 */
export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo');
  }

  // Validar que sea una imagen
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }

  // Validar tamaño (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('La imagen no debe superar los 5MB');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'aurora-joyeria/comprobantes'); // Organiza en carpetas

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url; // Retorna la URL segura de la imagen
  } catch (error) {
    console.error('Error en uploadToCloudinary:', error);
    throw error;
  }
};

/**
 * Valida un archivo antes de subirlo
 * @param {File} file - Archivo a validar
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen (JPG, PNG, etc.)' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen no debe superar los 5MB' };
  }

  return { valid: true, error: null };
};