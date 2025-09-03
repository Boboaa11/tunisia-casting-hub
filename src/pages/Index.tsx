import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            Tunisia Casting Hub
          </h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Your gateway to the entertainment industry in Tunisia
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
