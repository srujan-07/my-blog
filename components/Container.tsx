import React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[800px] mx-auto px-6 sm:px-10 lg:px-12 w-full">
      {children}
    </div>
  );
};
