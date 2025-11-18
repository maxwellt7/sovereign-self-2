import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white items-center justify-center p-12">
        <div className="max-w-md">
          <div className="mb-8">
            <svg
              className="w-20 h-20 mx-auto mb-4"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 20L65 35L50 50L35 35L50 20Z"
                fill="#B69960"
                stroke="#B69960"
                strokeWidth="2"
              />
              <path
                d="M25 45L50 70L75 45L65 35L50 50L35 35L25 45Z"
                stroke="#B69960"
                strokeWidth="2"
                fill="none"
              />
              <rect x="25" y="75" width="50" height="3" fill="#B69960" />
            </svg>
            <h1 className="text-4xl font-logo text-center tracking-wider">SOVEREIGN</h1>
          </div>
          <p className="text-xl text-center text-gray-300 mb-6">
            Move with clarity. Your presence is felt before you speak.
          </p>
          <p className="text-center text-gray-400">
            A tool for individuals who want to grow quickly through reflection.
          </p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

