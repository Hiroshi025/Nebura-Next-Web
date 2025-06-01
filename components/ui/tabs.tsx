"use client";


import React, { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs = TabsPrimitive.Root;
const TabsContext = createContext<TabsContextType | undefined>(undefined);

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;


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

// Nuevo componente TabsProvider
interface TabsProviderProps {
  children: React.ReactNode;
  defaultTab: string;
}

export const TabsProvider = ({ children, defaultTab }: TabsProviderProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
