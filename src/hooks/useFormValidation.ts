import { useState, useCallback } from "react";

export interface ValidationErrors {
  [key: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+?\d{1,3}[\s-]?)?\d{6,14}$/;

export const validateEmail = (email: string): string => {
  if (!email) return "L'email est requis";
  if (!EMAIL_REGEX.test(email)) return "Format d'email invalide";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Le mot de passe est requis";
  if (password.length < 8) return "Minimum 8 caractères";
  if (!/[A-Z]/.test(password)) return "Au moins une majuscule";
  if (!/[a-z]/.test(password)) return "Au moins une minuscule";
  if (!/[0-9]/.test(password)) return "Au moins un chiffre";
  return "";
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return "Veuillez confirmer le mot de passe";
  if (password !== confirmPassword) return "Les mots de passe ne correspondent pas";
  return "";
};

export const validateRequired = (value: string, label: string): string => {
  if (!value.trim()) return `${label} est requis`;
  return "";
};

export const validatePhone = (phone: string): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/[\s-]/g, "");
  if (!PHONE_REGEX.test(cleaned)) return "Format de téléphone invalide";
  return "";
};

export const validateAge = (age: string): string => {
  if (!age) return "";
  const num = parseInt(age);
  if (isNaN(num) || num < 3 || num > 120) return "Âge invalide (3-120)";
  return "";
};

export const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { level: score, label: "Faible", color: "bg-destructive" };
  if (score <= 3) return { level: score, label: "Moyen", color: "bg-yellow-500" };
  return { level: score, label: "Fort", color: "bg-green-500" };
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const markTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const isTouched = useCallback((field: string) => touched[field] || false, [touched]);

  const getError = useCallback((field: string) => (touched[field] ? errors[field] : ""), [errors, touched]);

  const hasErrors = useCallback(() => Object.values(errors).some(e => e !== ""), [errors]);

  return { errors, setFieldError, markTouched, isTouched, getError, hasErrors, setErrors };
};
