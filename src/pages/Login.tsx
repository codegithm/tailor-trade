import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook" | "x") => {
    window.location.href = `/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-teal-600">
            TailorTrade
          </h1>
          <p className="text-slate-600 mt-2">
            Connect with talented tailors or showcase your designs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Social Login Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-100"
                onClick={() => handleSocialLogin("google")}
              >
                {/* Google SVG */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <g>
                    <path
                      fill="#4285F4"
                      d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.711-1.594-3.93-2.57-6.688-2.57-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.719 0-.656-.07-1.148-.164-1.531z"
                    />
                    <path
                      fill="#34A853"
                      d="M3.545 7.548l3.273 2.402c.891-1.242 2.273-2.023 3.898-2.023 1.18 0 2.242.406 3.078 1.078l2.32-2.32c-1.422-1.32-3.25-2.125-5.398-2.125-3.242 0-5.977 2.203-6.953 5.188z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12.716 21.454c2.43 0 4.477-.805 5.969-2.188l-2.75-2.25c-.781.523-1.781.828-3.219.828-2.484 0-4.594-1.68-5.352-3.953l-3.242 2.5c1.523 3.008 4.703 5.063 8.594 5.063z"
                    />
                    <path
                      fill="#EA4335"
                      d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.93 0 3.227.82 3.969 1.523l2.719-2.648c-1.711-1.594-3.93-2.57-6.688-2.57-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.719 0-.656-.07-1.148-.164-1.531z"
                    />
                  </g>
                </svg>
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-100"
                onClick={() => handleSocialLogin("facebook")}
              >
                {/* Facebook SVG */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#1877F3"
                    d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"
                  />
                </svg>
                Continue with Facebook
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-slate-200 hover:bg-slate-100"
                onClick={() => handleSocialLogin("x")}
              >
                {/* X (Twitter) SVG */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#000"
                    d="M17.53 2.477h3.75l-8.19 9.37 9.64 9.676h-7.56l-5.94-6.68-6.78 6.68H1.5l8.74-9.57L.36 2.477h7.73l5.37 6.03 6.07-6.03zm-1.32 16.13h2.08L6.62 4.19H4.42l11.79 14.417z"
                  />
                </svg>
                Continue with X
              </Button>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-slate-200" />
              <span className="mx-2 text-slate-400 text-xs uppercase">or</span>
              <div className="flex-grow h-px bg-slate-200" />
            </div>
            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error &&
                (() => {
                  const err: any = error;
                  return (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {typeof err === "string"
                          ? err
                          : err.message || "An error occurred."}
                        {typeof err !== "string" && err.error && (
                          <details style={{ marginTop: 8 }}>
                            <summary>Details</summary>
                            <pre
                              style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                              }}
                            >
                              {JSON.stringify(err.error, null, 2)}
                            </pre>
                          </details>
                        )}
                      </AlertDescription>
                    </Alert>
                  );
                })()}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-teal-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center w-full text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo accounts */}
        <div className="mt-8 bg-white rounded-lg p-4 border border-slate-200">
          <h3 className="text-sm font-semibold mb-2">Demo Accounts</h3>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="p-2 bg-slate-50 rounded">
              <p>
                <strong>Customer:</strong> john@example.com
              </p>
              <p className="text-slate-500 text-xs">
                Use any password to login
              </p>
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <p>
                <strong>Tailor:</strong> michael@tailor.com
              </p>
              <p className="text-slate-500 text-xs">
                Use any password to login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
