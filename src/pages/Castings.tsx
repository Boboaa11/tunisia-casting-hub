import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Film, Tv, Theater } from "lucide-react";
import Layout from "@/components/Layout";
import { useCasting, Casting } from "@/contexts/CastingContext";
import { useAuth } from "@/contexts/AuthContext";
import CastingApplicationDialog from "@/components/CastingApplicationDialog";

const Castings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { castings } = useCasting();
  const { user, isAuthenticated, setRedirectAfterAuth } = useAuth();
  
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  const [selectedCasting, setSelectedCasting] = useState<Casting | null>(null);

  // Handle redirect back with apply param
  useEffect(() => {
    const applyId = searchParams.get('apply');
    if (applyId && isAuthenticated && user?.role === 'talent' && user?.hasSubscription) {
      const casting = castings.find(c => c.id === parseInt(applyId));
      if (casting) {
        setSelectedCasting(casting);
        setApplicationDialogOpen(true);
        // Clean up URL
        navigate('/castings', { replace: true });
      }
    }
  }, [searchParams, isAuthenticated, user, castings, navigate]);

  const categories = [
    { id: "all", label: "All Categories", icon: null },
    { id: "tv", label: "TV Series", icon: Tv },
    { id: "film", label: "Film", icon: Film },
    { id: "theater", label: "Theater", icon: Theater },
    { id: "commercial", label: "Commercial", icon: null }
  ];

  const filteredCastings = castings.filter(casting => {
    const matchesSearch = casting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         casting.production.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         casting.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || casting.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tv": return "bg-blue-100 text-blue-800";
      case "film": return "bg-purple-100 text-purple-800";
      case "theater": return "bg-green-100 text-green-800";
      case "commercial": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleApply = (casting: Casting) => {
    // Case 1: Not authenticated - redirect to login
    if (!isAuthenticated) {
      setRedirectAfterAuth(`/castings?apply=${casting.id}`);
      navigate('/login?message=login_required&castingId=' + casting.id);
      return;
    }

    // Case 2: Authenticated but not a talent
    if (user?.role !== 'talent') {
      // Producers can't apply
      return;
    }

    // Case 3: Talent without subscription - redirect to subscription page
    if (!user?.hasSubscription) {
      navigate(`/subscription?message=subscription_required&castingId=${casting.id}`);
      return;
    }

    // Case 4: Talent with subscription - open application dialog
    setSelectedCasting(casting);
    setApplicationDialogOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Current Casting Calls
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exciting opportunities in Tunisia's entertainment industry
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search castings, productions, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 shadow-card"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-sm"
                >
                  {category.icon && <category.icon className="h-4 w-4 mr-2" />}
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Castings Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCastings.map((casting, index) => (
              <Card key={casting.id} className="shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 bg-card animate-slide-up cursor-pointer" style={{animationDelay: `${index * 0.1}s`}} onClick={() => navigate(`/casting/${casting.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-foreground">{casting.title}</CardTitle>
                    <Badge variant="secondary" className={getCategoryColor(casting.category)}>
                      {casting.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{casting.production}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{casting.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {casting.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Deadline: {new Date(casting.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-foreground">Requirements:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {casting.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">{casting.compensation}</span>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={(e) => { e.stopPropagation(); handleApply(casting); }}
                      disabled={user?.role === 'producer'}
                    >
                      {user?.role === 'producer' ? 'Producteur' : 'Apply Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCastings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No castings found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Application Dialog */}
      <CastingApplicationDialog
        casting={selectedCasting}
        role={selectedCasting?.roles?.[0] || null}
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
      />
    </Layout>
  );
};

export default Castings;
