import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { UserRole } from "../types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/lib/config";

// Mock data for dashboard charts
const salesData = [
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 0 },
  { month: "Apr", sales: 2 },
  { month: "May", sales: 3 },
  { month: "Jun", sales: 1 },
];

const requestsData = [
  { category: "Formal", count: 3 },
  { category: "Business", count: 5 },
  { category: "Casual", count: 2 },
  { category: "Semi-formal", count: 1 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return (
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-slate-600 mb-6">
          Please log in to view your dashboard
        </p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  // Only allow tailors to access the dashboard
  if (user.role !== UserRole.TAILOR) {
    return (
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-6">
          Only tailors can access the dashboard.
        </p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const [userDesigns, setUserDesigns] = useState<any[]>([]);
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [userBids, setUserBids] = useState<any[]>([]);

  // Fetch dashboard data from backend
  useEffect(() => {
    if (user) {
      setUserDesigns([]);
      setUserRequests([]);
      setUserBids([]);
      fetch(`${BACKEND_URL}/dashboard/designs/${user.id}`)
        .then((res) => res.json())
        .then((data) => setUserDesigns(data.designs));
      fetch(`${BACKEND_URL}/dashboard/requests/open`)
        .then((res) => res.json())
        .then((data) => {
          setUserRequests(data.requests);
        });
      fetch(`${BACKEND_URL}/dashboard/bids/${user.id}`)
        .then((res) => res.json())
        .then((data) => setUserBids(data.bids));
    }
  }, [user]);

  // Tailor accepts a request
  const handleAcceptRequest = async (requestId: string) => {
    if (!user) return;
    const res = await fetch(
      `${BACKEND_URL}/dashboard/requests/${requestId}/accept`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tailorId: user.id }),
      }
    );
    if (res.ok) {
      toast({
        title: "Request accepted!",
        description: "The customer will be notified.",
      });
      // Remove the accepted request from the list
      setUserRequests((prev) => prev.filter((r) => r.id !== requestId));
    } else {
      toast({
        title: "Error",
        description: "Failed to accept request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Welcome back, {user.name}</p>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="designs">Designs</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="bids">Bids</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Designs"
              value={userDesigns.length}
              description="Designs you've created"
              color="teal"
            />
            <StatCard
              title="Bids Sent"
              value={userBids.length}
              description="Bids waiting for response"
              color="amber"
            />
            <StatCard
              title="Revenue"
              value="$1,239"
              description="Total earnings"
              color="slate"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales History</CardTitle>
                <CardDescription>Your recent sales</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#0f766e"
                      name="Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>
                  Most requested design categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={requestsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#d97706" name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-teal-500" />
                    <div>
                      <p className="font-medium">
                        New message from Sarah Davis
                      </p>
                      <p className="text-sm text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-amber-500" />
                    <div>
                      <p className="font-medium">
                        New customer request for formal wear
                      </p>
                      <p className="text-sm text-slate-500">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-slate-500" />
                    <div>
                      <p className="font-medium">New design upload completed</p>
                      <p className="text-sm text-slate-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/designs/new">
                    <Button className="w-full" variant="outline">
                      Add Design
                    </Button>
                  </Link>
                  <Link to="/requests">
                    <Button className="w-full" variant="outline">
                      Browse Requests
                    </Button>
                  </Link>
                  <Link to="/bids">
                    <Button className="w-full" variant="outline">
                      Manage Bids
                    </Button>
                  </Link>
                  <Link to="/chat">
                    <Button className="w-full" variant="outline">
                      Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Designs Tab (Tailors only) */}
        {user.role === UserRole.TAILOR && (
          <TabsContent value="designs">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Designs</h2>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate("/designs/new");
                  }}
                >
                  Add New Design
                </Button>
              </div>

              {userDesigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userDesigns.map((design) => (
                    <div
                      key={design.id}
                      className="border rounded-lg overflow-hidden bg-white"
                    >
                      <div className="h-40">
                        <img
                          src={design.imageUrl}
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold">{design.title}</h3>
                        <p className="text-sm text-slate-500 mb-2">
                          {design.category} • ${design.price}
                        </p>
                        <div className="flex justify-end">
                          <Link to={`/designs/edit/${design.id}`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Link to={`/marketplace/${design.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">
                    You haven't added any designs yet.
                  </p>
                  <Link to="/designs/new">
                    <Button>Add Your First Design</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Requests Tab */}
        <TabsContent value="requests">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Customer Requests</h2>
            </div>

            {userRequests.length > 0 ? (
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
                    {userRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="p-3">{request.title}</td>
                        <td className="p-3">
                          <RequestStatusBadge status={request.status} />
                        </td>
                        <td className="p-3">${request.proposedPrice}</td>
                        <td className="p-3">
                          {new Date(request.created).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/requests/${request.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                            {request.status === "open" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleAcceptRequest(request.id)}
                              >
                                Accept
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">
                  There are no matching customer requests at the moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Bids Tab (Tailors only) */}
        {user.role === UserRole.TAILOR && (
          <TabsContent value="bids">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">My Bids</h2>

              {userBids.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Request</th>
                        <th className="text-left p-3">Your Bid</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {userBids.map((bid) => {
                        const request = userRequests.find(
                          (r) => r.id === bid.requestId
                        );

                        return (
                          <tr key={bid.id}>
                            <td className="p-3">
                              {request?.title || "Unknown Request"}
                            </td>
                            <td className="p-3">${bid.price}</td>
                            <td className="p-3">
                              <BidStatusBadge status={bid.status} />
                            </td>
                            <td className="p-3">
                              {new Date(bid.created).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <Link to={`/requests/${bid.requestId}`}>
                                  <Button variant="ghost" size="sm">
                                    View Request
                                  </Button>
                                </Link>
                                {bid.status === "accepted" && (
                                  <Link to={`/chat`}>
                                    <Button variant="outline" size="sm">
                                      Message Customer
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-4">
                    You haven't placed any bids yet.
                  </p>
                  <Link to="/requests">
                    <Button>Browse Customer Requests</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Helper components
const StatCard = ({
  title,
  value,
  description,
  color = "teal",
}: {
  title: string;
  value: string | number;
  description: string;
  color?: "teal" | "amber" | "slate";
}) => {
  const colorClasses = {
    teal: "bg-teal-50 border-teal-200",
    amber: "bg-amber-50 border-amber-200",
    slate: "bg-slate-50 border-slate-200",
  };

  const valueColorClasses = {
    teal: "text-teal-700",
    amber: "text-amber-700",
    slate: "text-slate-700",
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className={`text-3xl font-bold mb-2 ${valueColorClasses[color]}`}>
        {value}
      </p>
      {description && <p className="text-sm text-slate-600">{description}</p>}
    </div>
  );
};

const RequestStatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    open: "bg-green-100 text-green-800 border-green-200",
    accepted: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-slate-100 text-slate-800 border-slate-200",
    closed: "bg-red-100 text-red-800 border-red-200",
  };

  const color =
    statusColors[status as keyof typeof statusColors] ||
    "bg-slate-100 text-slate-800";

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const BidStatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    declined: "bg-red-100 text-red-800 border-red-200",
  };

  const color =
    statusColors[status as keyof typeof statusColors] ||
    "bg-slate-100 text-slate-800";

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default Dashboard;
