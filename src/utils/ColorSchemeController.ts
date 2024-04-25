import React from "react";

// Biblioteca
import { useLocation } from "react-router-dom";

const ColorSchemeController = () => {
  const location = useLocation();

  const setThemeColor = () => {
    const firstPart = location.pathname.split("/");

    if (
      firstPart[1] === "" ||
      firstPart[1] === "detaildav" ||
      firstPart[2] === "table"
    ) {
      return "bg-[#fa6602]"; // Cor para a rota home e /detaildav
    }

    return "bg-blue-700 "; // Cor padrão
  };

  return { setThemeColor, location };
};

export default ColorSchemeController;
