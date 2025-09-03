import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Star, Film, Camera, Megaphone } from "lucide-react";
import Layout from "@/components/Layout";
import heroImage from "@/assets/hero-casting.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Simplified Hero Section for Testing */}
      <section className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Tunisia Casting Hub
          </h1>
          <p className="text-xl mb-8">
            Your gateway to the entertainment industry in Tunisia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/castings">Browse Castings</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
