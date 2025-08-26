import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/lib/config";

// NOTE: For camera access in iframe to work reliably:
// - Your site and the Bodygram Scanner must be served over HTTPS.
// - The iframe must have allow="camera; microphone; accelerometer; magnetometer; gyroscope".
// - The user must grant camera permission in the browser.
// - Some browsers may require user interaction to trigger camera access.

interface BodygramScannerProps {
  userId: string;
  onScanComplete: (payload: any) => void;
}

const BodygramScanner = ({ userId, onScanComplete }: BodygramScannerProps) => {
  const [loading, setLoading] = useState(false);
  const [scannerUrl, setScannerUrl] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPermissionState, setCameraPermissionState] = useState<
    string | null
  >(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for scan completion from Bodygram
      if (typeof event.data === "object" && event.data?.type === 2) {
        // type 2 = scan complete
        onScanComplete(event.data.payload);
        setShowScanner(false);
      }
      // type 0 = close signal
      if (typeof event.data === "object" && event.data?.type === 0) {
        setShowScanner(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onScanComplete]);

  const handleStartScan = async () => {
    setLoading(true);
    setCameraError(null);

    // Always prompt for camera permission by calling getUserMedia in the user gesture.
    // This triggers the browser's permission prompt on desktop and mobile.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Immediately stop tracks; we only needed to trigger permission.
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      // Check Permissions API if available and surface state
      try {
        const perms = (navigator as any).permissions;
        if (perms && perms.query) {
          try {
            const p = await perms.query({ name: "camera" });
            setCameraPermissionState(p.state);
          } catch (perr) {
            // ignore
          }
        }
      } catch (e) {
        // ignore
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // Immediately stop tracks; we only needed to trigger permission.
        stream.getTracks().forEach((t) => t.stop());
      } catch (err: any) {
        console.error("getUserMedia error:", err);
        const name = err?.name || "Error";
        const message = err?.message || "Permission denied or not available";
        setCameraError(`${name}: ${message}`);
        setLoading(false);
        return;
      }
    }

    // After permission granted (or at least prompt shown), fetch token and open iframe on the same page
    try {
      const res = await fetch(`${BACKEND_URL}/bodygram/scan-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!data.token) {
        setLoading(false);
        alert("Failed to get scan token");
        return;
      }
      const orgId = import.meta.env.VITE_BODYGRAM_ORG_ID;
      const url = `https://platform.bodygram.com/en/${orgId}/scan?token=${data.token}&system=metric&tap=true`;
      setScannerUrl(url);
      setShowScanner(true);
    } catch (err) {
      console.error("Failed to fetch scan token:", err);
      setCameraError("Failed to prepare scanner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Try to request camera permission (will trigger browser prompt in many cases)
  const requestPermission = async () => {
    setCameraError(null);
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      // Permission granted, open scanner
      setLoading(false);
      // If scanner URL already available, show scanner; otherwise start flow
      if (scannerUrl) {
        setShowScanner(true);
      } else {
        await handleStartScan();
      }
    } catch (err) {
      setCameraError(
        "Camera permission was not granted. If you've previously blocked the camera, open your browser site settings to enable it."
      );
      setLoading(false);
    }
  };

  return (
    <div>
      {!showScanner ? (
        <>
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            onClick={handleStartScan}
            disabled={loading}
          >
            {loading
              ? "Preparing Scanner..."
              : "Start AI Measurement (Bodygram)"}
          </Button>
          {cameraError && (
            <div className="text-red-600 text-sm mt-2">
              <div>{cameraError}</div>
              {cameraPermissionState && (
                <div className="text-xs text-slate-500 mt-1">
                  Permission state: {cameraPermissionState}
                </div>
              )}
              <div className="mt-2 flex gap-2">
                <Button variant="outline" onClick={requestPermission}>
                  Retry permission
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    window.open(
                      "https://support.google.com/chrome/answer/2693767",
                      "_blank"
                    )
                  }
                >
                  How to enable camera
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="relative w-full" style={{ height: "80vh" }}>
          <Button
            className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowScanner(false)}
          >
            Close
          </Button>
          <iframe
            ref={iframeRef}
            src={scannerUrl!}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="camera; microphone; display-capture; accelerometer; gyroscope; magnetometer; autoplay; fullscreen"
            title="Bodygram Scanner"
          />
          <div className="left-2 z-20 flex gap-2">
            <Button
              variant="outline"
              onClick={() => scannerUrl && window.open(scannerUrl, "_blank")}
            >
              Open scanner in new tab
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                // Try requesting permission again
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                  });
                  stream.getTracks().forEach((t) => t.stop());
                  setCameraError(null);
                } catch (err) {
                  setCameraError("Camera permission was not granted.");
                }
              }}
            >
              Request camera permission
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodygramScanner;
