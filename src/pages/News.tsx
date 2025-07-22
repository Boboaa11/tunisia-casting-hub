import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";

const News = () => {
  const newsArticles = [
    {
      id: 1,
      title: "Tunisia's Film Industry Sees Record Growth in 2024",
      excerpt: "The Tunisian cinema sector has experienced unprecedented growth this year, with international co-productions increasing by 40%.",
      category: "Industry",
      date: "2024-07-20",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1489599387206-d8e6b0b3edd2?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "New Tax Incentives for International Productions",
      excerpt: "The government announces new financial incentives to attract foreign film productions to Tunisia.",
      category: "Policy",
      date: "2024-07-18",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Carthage Film Festival 2024 Announces Lineup",
      excerpt: "This year's festival promises to showcase the best of Tunisian and North African cinema.",
      category: "Festival",
      date: "2024-07-15",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 4,
      title: "Rising Stars: Young Tunisian Actors Making Waves",
      excerpt: "Meet the new generation of Tunisian talent breaking into international markets.",
      category: "Talent",
      date: "2024-07-12",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "Digital Revolution in Tunisian Media Production",
      excerpt: "How streaming platforms are changing the landscape of content creation in Tunisia.",
      category: "Technology",
      date: "2024-07-10",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1551818255-e6e10975cd17?w=800&h=400&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "Location Spotlight: Historic Sites as Film Backdrops",
      excerpt: "Exploring Tunisia's most popular filming locations and their contribution to the industry.",
      category: "Locations",
      date: "2024-07-08",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&h=400&fit=crop",
      featured: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "industry": return "bg-blue-100 text-blue-800";
      case "policy": return "bg-green-100 text-green-800";
      case "festival": return "bg-purple-100 text-purple-800";
      case "talent": return "bg-orange-100 text-orange-800";
      case "technology": return "bg-red-100 text-red-800";
      case "locations": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-card py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Entertainment News
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest from Tunisia's entertainment industry
            </p>
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <Card className="mb-12 overflow-hidden shadow-elegant bg-gradient-card animate-slide-up">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <Badge className={getCategoryColor(featuredArticle.category)}>
                      {featuredArticle.category}
                    </Badge>
                    <Badge variant="secondary" className="ml-2">Featured</Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featuredArticle.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredArticle.readTime}
                      </div>
                    </div>
                    <Button variant="default">
                      Read More
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Regular Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article, index) => (
              <Card key={article.id} className="overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 bg-card animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Badge className={getCategoryColor(article.category)} variant="secondary">
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground space-x-3">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <Card className="mt-16 bg-gradient-hero text-primary-foreground shadow-glow animate-slide-up">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay In The Loop</h3>
              <p className="mb-6 text-primary-foreground/90">
                Get the latest entertainment news and casting opportunities delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md text-foreground bg-white border-0 focus:ring-2 focus:ring-accent"
                />
                <Button variant="premium" className="bg-white text-primary hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default News;