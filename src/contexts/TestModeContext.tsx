import React, { createContext, useContext, useEffect, useState } from "react";

interface TestModeContextType {
  isTestMode: boolean;
  createTestId: (id: string) => { [key: string]: string };
}

const TestModeContext = createContext<TestModeContextType>({
  isTestMode: false,
  createTestId: () => ({}),
});

export const useTestMode = () => useContext(TestModeContext);

// Funções utilitárias para lidar com cookies
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, days = 365): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

export const TestModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const cookieValue = getCookie("ebinex:testMode");

    if (cookieValue === "true") {
      setIsTestMode(true);
      return;
    }

    const urlParam = new URLSearchParams(window.location.search).get("mode");
    if (urlParam === "EBX_TEST") {
      setCookie("ebinex:testMode", "true");
      setIsTestMode(true);
    }
  }, []);

  const createTestId = (id: string) =>
    isTestMode ? { "data-test-id": id } : {};

  return (
    <TestModeContext.Provider value={{ isTestMode, createTestId }}>
      {children}
    </TestModeContext.Provider>
  );
};
