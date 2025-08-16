import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    style={{
      background: "#0070f3",
      color: "#fff",
      border: "none",
      borderRadius: 6,
      padding: "0.75rem 1.5rem",
      fontWeight: 600,
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background 0.2s",
      marginTop: 8,
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
