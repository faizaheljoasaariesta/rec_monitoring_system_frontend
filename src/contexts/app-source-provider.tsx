"use client";

import { useContext, useEffect, useState } from "react";
import { AppSourceContext } from "./app-source-context";

export function AppSourceProvider({ children }: { children: React.ReactNode }) {
  const [appSource, setAppSourceState] = useState<string>("RG_AA_IOT");

  useEffect(() => {
    const saved = localStorage.getItem("app_source");
    if (saved) {
      setAppSourceState(saved);
    }
  }, []);

  const setAppSource = (value: string) => {
    setAppSourceState(value);
    localStorage.setItem("app_source", value);
  };

  return (
    <AppSourceContext.Provider value={{ appSource, setAppSource }}>
      {children}
    </AppSourceContext.Provider>
  );
}

export function useAppSource() {
  const context = useContext(AppSourceContext);
  if (!context) {
    throw new Error("useAppSource must be used inside AppSourceProvider");
  }
  return context;
}