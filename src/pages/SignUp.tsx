import React, { useState, FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import PasswordStrength from "../components/PasswordStrength";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation";
// import styles from "../styles/global.css";

const SignUp: React.FC = () => {
  const { user, signUp, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    name: "",
    password: "",
  });

  const passwordValidation = validatePassword(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors on change
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: "", name: "", password: "" };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!validateName(formData.name)) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    if (!passwordValidation.isValid) {
      newErrors.password = "Password does not meet requirements";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await signUp(formData);
    } catch (err) {
      console.log("Error in SignUp:", err);
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            error={formErrors.email}
          />

          <FormInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            required
            error={formErrors.name}
          />

          <FormInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            error={formErrors.password}
          />

          <PasswordStrength
            password={formData.password}
            validation={passwordValidation}
          />

          <Button type="submit" disabled={loading} className="full-width">
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
