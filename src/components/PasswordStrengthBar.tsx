import { getPasswordStrength } from "@/hooks/useFormValidation";

interface PasswordStrengthBarProps {
  password: string;
}

const PasswordStrengthBar = ({ password }: PasswordStrengthBarProps) => {
  const { level, label, color } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= level ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${level <= 2 ? "text-destructive" : level <= 3 ? "text-yellow-600" : "text-green-600"}`}>
        Sécurité : {label}
      </p>
    </div>
  );
};

export default PasswordStrengthBar;
