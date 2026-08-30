export type ExcelImageExtension = "jpeg" | "png";

export interface ExcelImageData {
  base64: string;
  extension: ExcelImageExtension;
}

export async function imageUrlToBase64(
  url?: string,
): Promise<ExcelImageData | null> {
  if (!url) return null;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Unable to load image: ${url}`);
      return null;
    }

    const blob = await response.blob();

    const extension: ExcelImageExtension = blob.type.includes("png")
      ? "png"
      : "jpeg";

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;

        if (typeof result !== "string") {
          reject(new Error("Unable to convert image to base64"));
          return;
        }

        const base64 = result.split(",")[1];

        if (!base64) {
          reject(new Error("Image base64 data is empty"));
          return;
        }

        resolve({
          base64,
          extension,
        });
      };

      reader.onerror = () => {
        reject(new Error("Unable to read image"));
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Image loading failed:", error);
    return null;
  }
}
