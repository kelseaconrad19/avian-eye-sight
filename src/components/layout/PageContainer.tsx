
import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export function PageContainer({ children, title, className = "" }: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      {title && (
        <h1 className="text-3xl font-bold mb-6 font-display text-foreground">{title}</h1>
      )}
      {children}
    </div>
  );
}
