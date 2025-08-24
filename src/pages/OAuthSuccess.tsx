import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    if (token) localStorage.setItem("jwt", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    // Optionally, fetch user info and store in context/localStorage
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-teal-600 mb-2">
          Signing you in...
        </h2>
        <p className="text-slate-600">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
