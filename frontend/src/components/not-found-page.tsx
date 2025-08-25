import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Ghost } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <div className="mb-6 animate-bounce">
        <Ghost className="w-20 h-20 text-primary" />
      </div>

      <h1 className="text-6xl font-extrabold tracking-tight text-foreground animate-pulse">
        404
      </h1>

      <p className="text-lg text-muted-foreground mt-2 animate-fadeIn">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <div className="mt-6">
        <Button
          size="lg"
          onClick={() => navigate("/")}
          className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
