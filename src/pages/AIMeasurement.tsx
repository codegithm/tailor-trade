import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BodygramScanner from "@/components/ai/BodygramScanner";
import { useAuth } from "../contexts/AuthContext";
import { BACKEND_URL } from "@/lib/config";

const AIMeasurement = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [measurements, setMeasurements] = useState<any | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleMeasurements = async (data: any) => {
    setMeasurements(data);
    setStep(2);
    try {
      const res = await fetch(
        `${BACKEND_URL}/dashboard/measurements/${user?.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to save measurements");
      toast({
        title: "Measurements processed!",
        description: "Your measurements have been successfully updated.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save measurements.",
        variant: "destructive",
      });
    }
  };

  const handleFinish = () => {
    navigate("/measurements");
  };

  const fetchAndSaveMeasurements = async (scanId: string) => {
    try {
      const res = await fetch(
        `https://platform.bodygram.com/api/scans/${scanId}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BODYGRAM_API_KEY}`,
            "X-Organization-Id": import.meta.env.VITE_BODYGRAM_ORG_ID,
          },
        }
      );
      const scanData = await res.json();
      const measurements = scanData.measurements || scanData;
      setMeasurements(measurements);
      setStep(2);
      // Save to backend
      await fetch(`${BACKEND_URL}/dashboard/measurements/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(measurements),
      });
      toast({
        title: "Measurements processed!",
        description: "Your measurements have been successfully updated.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch/save measurements.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Measurement Tool</h1>

      <Card>
        <CardHeader>
          <CardTitle>Let AI determine your measurements</CardTitle>
          <CardDescription>
            Our advanced AI system helps create accurate body measurements from
            photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-teal-800">
                  How it works
                </h3>
                <ol className="list-decimal ml-5 space-y-2 text-sm text-teal-700">
                  <li>
                    Take a full-body photo (front view, form-fitting clothes)
                  </li>
                  <li>Upload the photo using the button below</li>
                  <li>
                    Our AI will process your photo and calculate your
                    measurements
                  </li>
                </ol>
              </div>
              <BodygramScanner
                userId={user?.id || "guest"}
                onScanComplete={(payload) => {
                  // payload.scanId or payload.id
                  const scanId = payload.scanId || payload.id;
                  if (scanId) {
                    fetchAndSaveMeasurements(scanId);
                  } else {
                    toast({
                      title: "Error",
                      description: "Scan ID not found in payload.",
                      variant: "destructive",
                    });
                  }
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-center space-x-3">
                <svg
                  className="h-6 w-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-teal-800 font-medium">
                  Measurement complete!
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border">
                  <h3 className="font-medium mb-3">Your Measurements</h3>
                  <div className="space-y-2">
                    {measurements ? (
                      Object.entries(measurements).map(([key, value]) => (
                        <div className="flex justify-between" key={key}>
                          <span className="text-slate-500">{key}</span>
                          <span>{String(value)}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500">
                        No measurements found.
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h3 className="font-medium mb-3">Size Recommendations</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="font-medium">Tops: Medium (M)</p>
                      <p className="text-xs text-slate-500">
                        Based on chest and shoulder measurements
                      </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="font-medium">Bottoms: 34" Waist</p>
                      <p className="text-xs text-slate-500">
                        Based on waist and hip measurements
                      </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded">
                      <p className="font-medium">Formal Wear: 40R</p>
                      <p className="text-xs text-slate-500">
                        Based on chest and height measurements
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                These measurements have been saved to your profile and will be
                available to tailors when you place orders.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          {step === 1 ? (
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          ) : (
            <Button onClick={handleFinish}>Finish</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIMeasurement;
