import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Package, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BACKEND_URL } from "@/lib/config";

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<
    string | { message?: string; error?: any } | null
  >(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${BACKEND_URL}/dashboard/requests/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch((err) => {
        setError({ message: "Failed to fetch requests" });
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4">My Requests</h1>
        <p className="text-slate-600 mb-6">
          Please log in to view your requests
        </p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Requests</h1>
              <p className="text-lg text-muted-foreground">
                Track your custom design requests and collaborate with talented
                tailors.
              </p>
            </div>
            <Link to="/requests/new">
              <Button className="btn-accent group">
                <Plus className="mr-2 h-4 w-4" />
                Create New Request
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">Loading...</div>
          ) : error ? (
            <div className="text-center py-16 text-red-600">
              {typeof error === "string"
                ? error
                : error.message || "An error occurred."}
              {typeof error !== "string" && error.error && (
                <details style={{ marginTop: 8 }}>
                  <summary>Details</summary>
                  <pre
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                  >
                    {JSON.stringify(error.error, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : requests.length === 0 ? (
            <Card className="card-modern">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="h-10 w-10 text-accent" />
                  </div>
                  <CardTitle className="text-2xl mb-4">
                    No requests yet
                  </CardTitle>
                  <p className="text-muted-foreground mb-8">
                    Ready to create something amazing? Start by requesting a
                    custom design from our talented tailors.
                  </p>
                  <Link to="/requests/new">
                    <Button className="btn-accent group">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Request
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="p-3">{request.title}</td>
                      <td className="p-3">{request.status}</td>
                      <td className="p-3">${request.proposedPrice}</td>
                      <td className="p-3">
                        {new Date(request.created).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Link to={`/requests/${request.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
