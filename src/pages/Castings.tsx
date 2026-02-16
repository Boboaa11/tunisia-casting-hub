import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Film, Tv, Theater, Clock, DollarSign, Star, Users, ChevronRight, User } from "lucide-react";
import Layout from "@/components/Layout";
import { useCasting, Casting, CastingRole } from "@/contexts/CastingContext";
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
  const [selectedRole, setSelectedRole] = useState<CastingRole | null>(null);

  useEffect(() => {
    const applyId = searchParams.get('apply');
    if (applyId && isAuthenticated && user?.role === 'talent' && user?.hasSubscription) {
      const casting = castings.find(c => c.id === parseInt(applyId));
      if (casting) {
        setSelectedCasting(casting);
        setSelectedRole(casting.roles?.[0] || null);
        setApplicationDialogOpen(true);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tv": return Tv;
      case "film": return Film;
      case "theater": return Theater;
      default: return Film;
    }
  };

  const handleApply = (casting: Casting, role: CastingRole) => {
    if (!isAuthenticated) {
      setRedirectAfterAuth(`/castings?apply=${casting.id}`);
      navigate('/login?message=login_required&castingId=' + casting.id);
      return;
    }
    if (user?.role !== 'talent') return;
    if (!user?.hasSubscription) {
      navigate(`/subscription?message=subscription_required&castingId=${casting.id}`);
      return;
    }
    setSelectedCasting(casting);
    setSelectedRole(role);
    setApplicationDialogOpen(true);
  };

  const getRoleType = (roleName: string): string => {
    const lower = roleName.toLowerCase();
    if (lower.includes('lead') || lower.includes('principal')) return 'Lead';
    if (lower.includes('supporting')) return 'Supporting';
    if (lower.includes('extra') || lower.includes('figurant')) return 'Extra';
    return 'Role';
  };

  const getRoleTypeBadgeClass = (type: string): string => {
    switch (type) {
      case 'Lead': return 'bg-primary/10 text-primary border-primary/20';
      case 'Supporting': return 'bg-secondary/30 text-secondary-foreground border-secondary/40';
      case 'Extra': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-accent/20 text-accent-foreground border-accent/30';
    }
  };

  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)}mo ago`;
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

          {/* Castings List */}
          <div className="flex flex-col gap-5">
            {filteredCastings.map((casting, index) => {
              const CategoryIcon = getCategoryIcon(casting.category);
              const rolesPreview = casting.roles?.slice(0, 3) || [];
              const extraRoles = (casting.roles?.length || 0) - 3;

              return (
                <Card
                  key={casting.id}
                  className="shadow-card hover:shadow-elegant transition-all duration-300 bg-card animate-slide-up overflow-hidden border-border/60"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Project Overview */}
                    <div className="flex-1 p-6 lg:border-r border-border/40">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {casting.isPaid && (
                              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border border-accent/30 text-xs gap-1">
                                <Star className="h-3 w-3" /> Featured
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs gap-1 border-border">
                              <CategoryIcon className="h-3 w-3" />
                              {casting.type}
                            </Badge>
                          </div>
                          <h2
                            className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer leading-tight"
                            onClick={() => navigate(`/casting/${casting.id}`)}
                          >
                            {casting.title}
                          </h2>
                          <p className="text-sm text-muted-foreground font-medium mt-0.5">{casting.production}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {casting.description}
                      </p>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary flex-shrink-0" />
                          <span className="truncate">{casting.location}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="h-3.5 w-3.5 mr-1.5 text-primary flex-shrink-0" />
                          <span className="truncate">{casting.compensation}</span>
                        </div>
                        {casting.productionDates && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary flex-shrink-0" />
                            <span className="truncate">{casting.productionDates}</span>
                          </div>
                        )}
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-primary flex-shrink-0" />
                          <span className="truncate">
                            {casting.createdAt ? getTimeAgo(casting.createdAt) : `Deadline: ${new Date(casting.deadline).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => navigate(`/casting/${casting.id}`)}
                      >
                        View All Roles
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Right: Roles Preview */}
                    <div className="lg:w-[340px] xl:w-[380px] bg-muted/30 p-4 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Available Roles
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <Users className="h-3 w-3 inline mr-1" />
                          {casting.roles?.length || 0} roles
                        </span>
                      </div>

                      {rolesPreview.map((role) => {
                        const roleType = getRoleType(role.name);
                        return (
                          <div
                            key={role.id}
                            className="bg-card rounded-lg border border-border/60 p-3 flex items-center justify-between gap-3 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className="font-semibold text-sm text-foreground truncate">
                                  {role.name.replace(/\s*\(.*?\)\s*/g, '')}
                                </span>
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${getRoleTypeBadgeClass(roleType)}`}>
                                  {roleType}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {role.gender && (
                                  <span className="flex items-center gap-0.5">
                                    <User className="h-3 w-3" /> {role.gender}
                                  </span>
                                )}
                                {role.ageRange && (
                                  <span>• {role.ageRange}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="h-7 text-xs px-3 flex-shrink-0"
                              onClick={(e) => { e.stopPropagation(); handleApply(casting, role); }}
                              disabled={user?.role === 'producer'}
                            >
                              Apply
                            </Button>
                          </div>
                        );
                      })}

                      {extraRoles > 0 && (
                        <button
                          className="text-xs text-primary hover:text-primary-glow font-medium text-center py-1 transition-colors"
                          onClick={() => navigate(`/casting/${casting.id}`)}
                        >
                          + {extraRoles} more role{extraRoles > 1 ? 's' : ''}
                        </button>
                      )}

                      {(!casting.roles || casting.roles.length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-4">No roles listed yet</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredCastings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No castings found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <CastingApplicationDialog
        casting={selectedCasting}
        role={selectedRole}
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
      />
    </Layout>
  );
};

export default Castings;
