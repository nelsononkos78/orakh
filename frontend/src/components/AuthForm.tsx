import type { ReactNode } from "react";

interface AuthFormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
}

export default function AuthForm({ title, onSubmit, children }: AuthFormProps) {
  return (
    <div className="auth-container">
      <h1>{title}</h1>
      <form onSubmit={onSubmit} className="auth-form">
        {children}
      </form>
    </div>
  );
} 