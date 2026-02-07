interface FormFieldErrorProps {
  error?: string;
}

const FormFieldError = ({ error }: FormFieldErrorProps) => {
  if (!error) return null;
  return (
    <p className="text-sm text-destructive mt-1 animate-fade-in">{error}</p>
  );
};

export default FormFieldError;
