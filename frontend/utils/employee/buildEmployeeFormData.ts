import { EmployeeFormValues } from "@/constants/employee/defaultValues";

type EmployeeImages = {
  profileImage: File | null;
  cnicFrontImage: File | null;
  cnicBackImage: File | null;
};

export const buildEmployeeFormData = (
  values: EmployeeFormValues,
  images: EmployeeImages,
) => {
  const form = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      form.append(key, String(value));
    }
  });

  if (images.profileImage) {
    form.append("profileImage", images.profileImage);
  }

  if (images.cnicFrontImage) {
    form.append("cnicFrontImage", images.cnicFrontImage);
  }

  if (images.cnicBackImage) {
    form.append("cnicBackImage", images.cnicBackImage);
  }

  return form;
};
