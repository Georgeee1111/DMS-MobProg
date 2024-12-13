import React, { createContext, useContext, useState } from "react";

interface MultiSelectContextProps {
  isMultiSelectMode: boolean;
  setIsMultiSelectMode: (value: boolean) => void;
}

const MultiSelectContext = createContext<MultiSelectContextProps | undefined>(
  undefined
);

export const MultiSelectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  return (
    <MultiSelectContext.Provider
      value={{ isMultiSelectMode, setIsMultiSelectMode }}
    >
      {children}
    </MultiSelectContext.Provider>
  );
};

export const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within a MultiSelectProvider");
  }
  return context;
};
