"use client";
import React, { createContext, useContext, useMemo } from "react";
import { RootStore } from "@/stores/rootStore";

// 1. Create the context with proper typing
const StoreContext = createContext<RootStore | null>(null);

// 2. Create and provide the RootStore via context
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const rootStore = useMemo(() => new RootStore(), []); // singleton per render
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};

// 3. Custom hook to access the store safely
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
