"use client";

import React, { createContext, useContext } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}

export const Tabs = ({ children, value, onChange }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ activeTab: value, setActiveTab: onChange }}>
      <div className="flex flex-col w-full">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList = ({ children, className = "" }: TabsListProps) => {
  return (
    <div className={`flex border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

interface TabProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const Tab = ({ children, value, className = "" }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab must be used within a Tabs component");
  }

  const { activeTab, setActiveTab } = context;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        activeTab === value
          ? "text-purple-600 border-b-2 border-purple-600 dark:text-purple-400 dark:border-purple-400"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

export const TabPanel = ({ children, value, className = "" }: TabPanelProps) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabPanel must be used within a Tabs component");
  }

  const { activeTab } = context;

  return (
    <div className={`${activeTab === value ? "block" : "hidden"} ${className}`}>
      {children}
    </div>
  );
};