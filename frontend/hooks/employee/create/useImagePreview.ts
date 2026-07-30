import { useEffect, useMemo, useState } from "react";

export const useImagePreview = () => {
  const [image, setImage] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    return image ? URL.createObjectURL(image) : null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    image,
    setImage,
    previewUrl,
  };
};
