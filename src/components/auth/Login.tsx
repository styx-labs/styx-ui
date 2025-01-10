import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styxLogo from "../../assets/styx_name_logo_transparent.png";

export const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src={styxLogo} alt="Styx" className="h-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-gray-600">
            {isSignUp
              ? "Get started with AI-powered recruiting"
              : "Continue to your recruiting dashboard"}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors shadow-sm"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            {isSignUp ? "Sign up with Google" : "Sign in with Google"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {isSignUp ? "Already have an account?" : "New to Styx?"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            {isSignUp ? "Sign in instead" : "Create an account"}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          By continuing, you agree to Styx's{" "}
          <a
            href="https://docs.google.com/document/d/e/2PACX-1vTV6qdCbwZxepu_-2n3iaIJ1t1v25tTEC9G9wThl9sfX_lpSadxz4EBhe4c-XYvLXdT-rsaKegPu1mQ/pub"
            className="text-purple-600 hover:text-purple-700"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="https://docs.google.com/document/d/e/2PACX-1vTCX9pI4Kls120hUPaauLN8i6eWUk2x8jdSfhHcpSfdPo03ES63-XjCGLmDIRkwIncgUVCBqD6RCLk5/pub"
            className="text-purple-600 hover:text-purple-700"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};
