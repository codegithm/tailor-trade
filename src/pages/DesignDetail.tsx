import ImageSlider from "../components/ui/ImageSlider";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types";
import { BACKEND_URL } from "@/lib/config";

const DesignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [design, setDesign] = useState<any>(null);
  const [relatedDesigns, setRelatedDesigns] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch design and related designs from backend
  useEffect(() => {
    if (id) {
      fetch(`${BACKEND_URL}/design/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.design) {
            navigate("/marketplace");
          } else {
            setDesign(data.design);
          }
        });
      fetch(`${BACKEND_URL}/design/${id}/related`)
        .then((res) => res.json())
        .then((data) => setRelatedDesigns(data.designs));
    }
  }, [id, navigate]);

  if (!design) return null;

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/marketplace"
          className="text-teal-600 hover:underline mb-4 inline-block"
        >
          ← Back to Marketplace
        </Link>
        <h1 className="text-3xl font-bold">{design.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Design image */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="aspect-square overflow-hidden rounded-md relative">
              {Array.isArray(design.imageUrls) &&
              design.imageUrls.length > 0 ? (
                <ImageSlider images={design.imageUrls} title={design.title} />
              ) : (
                <img
                  src={design.imageUrl}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Design details */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">${design.price}</h2>
                  <Badge className="mt-1 bg-teal-600">{design.category}</Badge>
                </div>
                {design.fabricType && (
                  <Badge
                    variant="outline"
                    className="border-amber-600 text-amber-700"
                  >
                    {design.fabricType}
                  </Badge>
                )}
              </div>

              <p className="text-slate-700 mb-6">{design.description}</p>

              {design.availableSizes && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {design.availableSizes.map((size) => (
                      <Badge key={size} variant="secondary">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user && user.role === UserRole.CUSTOMER ? (
                <div className="space-y-3">
                  <Button className="w-full">Add to Cart</Button>
                  <Button variant="outline" className="w-full">
                    Contact Tailor
                  </Button>
                </div>
              ) : user &&
                user.role === UserRole.TAILOR &&
                user.id === design.tailorId ? (
                <div className="space-y-3">
                  <Button className="w-full">Edit Design</Button>
                </div>
              ) : !user ? (
                <Link to="/login">
                  <Button className="w-full">Log In to Purchase</Button>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Tailor information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">About the Tailor</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold">MC</span>
              </div>
              <div>
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm text-slate-600">Milan, Italy</p>
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-4">
              Master tailor with 15 years of experience specializing in suits
              and formal wear.
            </p>
            <Button variant="outline" className="w-full" size="sm">
              View Tailor Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Additional information tabs */}
      <div className="mt-10">
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">Details & Care</TabsTrigger>
            <TabsTrigger value="sizing">Sizing Information</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="font-bold text-lg mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-2 text-slate-700">
                  <li>
                    <strong>Material:</strong>{" "}
                    {design.fabricType || "Not specified"}
                  </li>
                  <li>
                    <strong>Style:</strong> {design.category}
                  </li>
                  <li>
                    <strong>Care Instructions:</strong> Dry clean only
                  </li>
                  <li>
                    <strong>Made in:</strong> Italy
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-slate-700">{design.description}</p>
                {design.tags && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {design.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="sizing"
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="font-bold text-lg mb-4">Sizing Information</h3>
            <p className="mb-4">
              This design is available in the following sizes:{" "}
              {design.availableSizes?.join(", ") || "Standard sizing"}
            </p>
            <p className="mb-4">
              For a perfect fit, we recommend using our AI measurement tool or
              providing your measurements directly to the tailor.
            </p>

            {user ? (
              <Link to="/measurements">
                <Button className="mr-4">Update My Measurements</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>Log In for Measurements</Button>
              </Link>
            )}
          </TabsContent>

          <TabsContent
            value="shipping"
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="font-bold text-lg mb-4">Shipping & Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-2">Shipping</h4>
                <p className="mb-3">
                  Custom designs typically take 2-3 weeks to produce after
                  measurements are confirmed.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Standard shipping: 5-7 business days</li>
                  <li>
                    Express shipping: 2-3 business days (additional fees apply)
                  </li>
                  <li>International shipping available to select countries</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Returns & Exchanges</h4>
                <p className="mb-3">
                  As these are custom-made items, returns are only accepted in
                  the following cases:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Manufacturing defects</li>
                  <li>Significant deviation from agreed-upon design</li>
                  <li>
                    Incorrect measurements (if measurements were taken by the
                    tailor)
                  </li>
                </ul>
                <p className="mt-3 text-sm">
                  Contact us within 7 days of delivery to initiate a return or
                  exchange.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related designs */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedDesigns.map((relatedDesign) => (
            <div
              key={relatedDesign.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={relatedDesign.imageUrl}
                  alt={relatedDesign.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {relatedDesign.title}
                </h3>
                <p className="text-teal-600 font-bold mt-1">
                  ${relatedDesign.price}
                </p>
                <Link to={`/marketplace/${relatedDesign.id}`}>
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
