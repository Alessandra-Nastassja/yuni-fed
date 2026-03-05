import { useState, useEffect } from "react";

import Welcome from "./components/Welcome/welcome";
import Logando from "./components/Logando/logando";

export default function Onboarding() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000); // 1 segundos

    // Limpa o timeout se o componente for desmontado
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showWelcome ? <Welcome /> : <Logando />}
    </>
  );
}