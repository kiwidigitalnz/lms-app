import { toast as sonnerToast, type ToastT } from "sonner";

export const toast = ({
  title,
  description,
  variant = "default",
}: {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
}) => {
  if (variant === "destructive") {
    return sonnerToast.error(description, {
      ...(title && { description: title })
    });
  }
  return sonnerToast.success(description, {
    ...(title && { description: title })
  });
};

export const useToast = () => ({ toast });