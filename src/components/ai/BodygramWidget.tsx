import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// NOTE: You need to set VITE_BODYGRAM_API_KEY in your .env file

interface BodygramWidgetProps {
  userId: string;
  onMeasurements: (measurements: any) => void;
  orgId?: string;
}

const BodygramWidget = ({
  userId,
  onMeasurements,
  orgId,
}: BodygramWidgetProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      // Step 1: Upload the image to Bodygram
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("external_id", userId);
      // You may need to add more fields depending on Bodygram's API
      const res = await fetch(
        "https://api.bodygram.com/v1/measurements/photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_BODYGRAM_API_KEY}`,
            ...(orgId ? { "X-Organization-Id": orgId } : {}),
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to get measurements");
      const data = await res.json();
      onMeasurements(data.measurements || data);
    } catch (err: any) {
      setError(err.message || "Failed to get measurements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Get My Measurements (AI)"}
      </Button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default BodygramWidget;
