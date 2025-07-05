import React, { createContext, useState, useContext } from "react";

export const DrawerContext = createContext();

export const DrawerProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <DrawerContext.Provider 
      value={{ 
        isDrawerOpen, 
        openDrawer, 
        closeDrawer, 
        toggleDrawer 
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

// Custom hook to use drawer context
export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
