import React from "react";
import "./ColorDot.css";

interface Props {
  color: string;
}

const ColorDot = ({ color }: Props) => {
  return (
    <svg width={16} height={16} className="color-dot">
      <circle cx="8" cy="8" r="8" fill={color} />
    </svg>
  );
};

export default ColorDot;
