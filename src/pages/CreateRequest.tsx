import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BACKEND_URL } from "@/lib/config";

const CreateRequest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (file) {
      setImageUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("quality", "auto:best");
        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          setImage(data.secure_url);
        } else {
          setImageError("Failed to upload image. Please try again.");
        }
      } catch (err) {
        setImageError("Failed to upload image. Please try again.");
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a request",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/dashboard/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          proposedPrice: Number(price),
          deadline,
          customerId: user.id,
          imageUrl: image,
        }),
      });
      if (res.ok) {
        toast({
          title: "Request created!",
          description:
            "Tailors will now be able to see your request and submit bids.",
        });
        window.location.replace("/requests");
        return;
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: (
            <>
              {data.message || "Failed to create request"}
              {data.error && (
                <details style={{ marginTop: 8 }}>
                  <summary>Details</summary>
                  <pre
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                  >
                    {JSON.stringify(data.error, null, 2)}
                  </pre>
                </details>
              )}
            </>
          ),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Request Custom Design</h1>
      <p className="text-slate-600 mb-6">
        Describe what you're looking for and tailors will submit proposals to
        create it for you.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="E.g. Wedding Dress, Business Suit, Casual Shirt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your desired design in detail including style, fabric preferences, fit, etc."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Budget/Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="1"
                placeholder="Your budget for this design"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500">
                This is your proposed budget. Tailors may offer different prices
                based on your requirements.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                When do you need this design completed? (Optional)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Reference Image (Optional)</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              {imageUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg
                    className="animate-spin h-8 w-8 text-teal-600 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <p className="text-sm text-slate-500">Uploading image...</p>
                </div>
              ) : image ? (
                <div className="space-y-4">
                  <img
                    src={image}
                    alt="Reference"
                    className="max-h-64 mx-auto rounded"
                  />
                  <p className="text-sm text-slate-500">
                    Image uploaded successfully
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <p className="mb-4 text-slate-500">
                    Upload a reference image to help tailors understand your
                    requirements
                  </p>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                      fileInputRef.current && fileInputRef.current.click()
                    }
                  >
                    Select Image
                  </Button>
                  {imageError && (
                    <div className="text-red-600 text-sm mt-2">
                      {imageError}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8 bg-cream p-6 rounded-lg border border-amber-200">
        <h3 className="font-semibold text-lg mb-2">
          Tips for a successful request
        </h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            <strong>Be specific</strong> - Clearly describe colors, fabrics, and
            style preferences
          </li>
          <li>
            <strong>Include references</strong> - Upload images that inspire
            your design
          </li>
          <li>
            <strong>Set a realistic budget</strong> - Consider materials and
            complexity
          </li>
          <li>
            <strong>Allow adequate time</strong> - Quality custom work takes
            time
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreateRequest;
