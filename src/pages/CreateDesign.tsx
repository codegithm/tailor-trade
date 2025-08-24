import { useState } from "react";
import React, { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { BACKEND_URL } from "@/lib/config";

const CreateDesign = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    fabricType: "",
    tags: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<
    string | { message?: string; error?: any } | null
  >(null);
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (user.role !== UserRole.TAILOR) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Create Design</h1>
        <p className="text-slate-600 mb-6">Only tailors can add new designs.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
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
          setImages((prev) => [...prev, data.secure_url]);
        }
      }
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          tailorId: user.id,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data === "object" && (data.message || data.error)
            ? { message: data.message, error: data.error }
            : { message: data.error || "Failed to create design" }
        );
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError({ message: "Failed to create design. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Design</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select category</option>
            <option value="FORMAL">Formal</option>
            <option value="BUSINESS">Business</option>
            <option value="CASUAL">Casual</option>
            <option value="SEMI_FORMAL">Semi-formal</option>
          </select>
        </div>
        <div>
          <Label htmlFor="fabricType">Fabric Type</Label>
          <Input
            name="fabricType"
            value={form.fabricType}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <div>
          <Label>Design Images</Label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div key={idx} className="space-y-2">
                    <img
                      src={img}
                      alt={`Design ${idx + 1}`}
                      className="max-h-40 mx-auto rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveImage(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
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
                  Upload one or more images to showcase your design
                </p>
              </>
            )}
            <div className="flex flex-col items-center">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="image/*"
                multiple
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
                Select Images
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input name="tags" value={form.tags} onChange={handleChange} />
        </div>
        {error && (
          <div className="text-red-600 text-sm">
            {typeof error === "string"
              ? error
              : error.message || "An error occurred."}
            {typeof error !== "string" && error.error && (
              <details style={{ marginTop: 8 }}>
                <summary>Details</summary>
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {JSON.stringify(error.error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Design"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDesign;
