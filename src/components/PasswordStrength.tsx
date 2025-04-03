import React from "react";
import styles from "../styles/PasswordStrength.module.css";

interface PasswordStrengthProps {
  password: string;
  validation: {
    hasMinLength: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  validation,
}) => {
  const { hasMinLength, hasLetter, hasNumber, hasSpecial } = validation;

  const getStrengthPercentage = (): number => {
    if (password.length === 0) return 0;

    let strength = 0;
    if (hasMinLength) strength += 25;
    if (hasLetter) strength += 25;
    if (hasNumber) strength += 25;
    if (hasSpecial) strength += 25;

    return strength;
  };

  const strengthPercentage = getStrengthPercentage();

  const getStrengthColor = (): string => {
    if (strengthPercentage < 50) return styles.weak;
    if (strengthPercentage < 100) return styles.medium;
    return styles.strong;
  };

  return (
    <div className={styles.passwordStrength}>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progress} ${getStrengthColor()}`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>
      <ul className={styles.requirements}>
        <li className={hasMinLength ? styles.valid : ""}>
          At least 8 characters
        </li>
        <li className={hasLetter ? styles.valid : ""}>At least one letter</li>
        <li className={hasNumber ? styles.valid : ""}>At least one number</li>
        <li className={hasSpecial ? styles.valid : ""}>
          At least one special character
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrength;
