// src/components/ui/Card.jsx
import React from "react";

export function Card({ children, style }) {
  return (
    <div style={{ 
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
      borderRadius: "8px", 
      padding: "16px", 
      backgroundColor: "#fff", 
      ...style 
    }}>
      {children}
    </div>
  );
}

export function CardContent({ children, style }) {
  return (
    <div style={{ marginTop: "8px", ...style }}>
      {children}
    </div>
  );
}
