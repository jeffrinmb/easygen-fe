import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";
import styles from "../styles/Navbar.module.css";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Auth App</Link>
      </div>
      <div className={styles.navLinks}>
        {user ? (
          <>
            <span className={styles.welcome}>Hello, {user.name}</span>
            <Button onClick={signOut}>Log Out</Button>
          </>
        ) : (
          <>
            <Link to="/signin" className={styles.navLink}>
              Sign In
            </Link>
            <Link to="/signup" className={styles.navLink}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
