import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ShieldBan } from "lucide-react";

export const NotAuthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-background text-center px-4">
      <div className="mb-6 animate-bounce">
        <ShieldBan className="w-20 h-20 text-rose-300" />
      </div>

      <h1 className="text-6xl font-extrabold tracking-tight text-foreground animate-pulse">
        Unauthorized
      </h1>

      <p className="text-lg text-muted-foreground mt-2 animate-fadeIn">
        Oops! You are not authorized to view this page
      </p>

      <div className="mt-6">
        <Button
          size="lg"
          onClick={() => navigate("/", { replace: true })}
          className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          Go back
        </Button>
      </div>
    </div>
  );
};
