import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/lib/config";

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<
    string | { message?: string; error?: any } | null
  >(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    proposedPrice: "",
    deadline: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/dashboard/requests/request/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.request) {
          setForm({
            title: data.request.title || "",
            description: data.request.description || "",
            proposedPrice: data.request.proposedPrice?.toString() || "",
            deadline: data.request.deadline
              ? data.request.deadline.split("T")[0]
              : "",
            imageUrl: data.request.imageUrl || "",
          });
        } else {
          setError({ message: "Request not found" });
        }
        setLoading(false);
      })
      .catch(() => {
        setError({ message: "Failed to fetch request" });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update a request",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/dashboard/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          proposedPrice: Number(form.proposedPrice),
          deadline: form.deadline,
          imageUrl: form.imageUrl,
        }),
      });
      if (res.ok) {
        toast({
          title: "Request updated!",
          description: "Your request has been updated.",
        });
        navigate("/requests");
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: (
            <>
              {data.message || "Failed to update request"}
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
        description: "Failed to update request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-16 text-red-500">
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
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom section-padding">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-1 font-medium" htmlFor="title">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    className="block mb-1 font-medium"
                    htmlFor="proposedPrice"
                  >
                    Proposed Price
                  </label>
                  <Input
                    id="proposedPrice"
                    name="proposedPrice"
                    type="number"
                    value={form.proposedPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="deadline">
                    Deadline
                  </label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium" htmlFor="imageUrl">
                    Image URL
                  </label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditRequest;
