import BackButton from "@/components/BackButton";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-6">
        <div className="mb-6 flex justify-center">
          <BackButton />
        </div>
        <h1 className="mb-2 text-4xl font-bold">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </div>
  );
};

export default Index;
