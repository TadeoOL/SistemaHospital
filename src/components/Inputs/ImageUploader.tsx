import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ImageUploader: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);

      // Mostrar SweetAlert2 con la dirección de la imagen
      Swal.fire({
        icon: 'success',
        title: 'Operación Exitosa',
        text: `Imagen subida correctamente, Dirección de la imagen: ${imageUrl}`,
      });
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageUrl && (
        <div>
          <p>Imagen seleccionada:</p>
          <img src={imageUrl} alt="Imagen seleccionada" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
