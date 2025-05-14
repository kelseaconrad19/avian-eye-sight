
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bird, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Bird className="h-24 w-24 text-primary mb-6 animate-bounce" />
      <h1 className="text-4xl font-bold mb-2 font-display">404</h1>
      <p className="text-xl text-muted-foreground mb-8 text-center">
        Oops! This bird has flown the nest.
      </p>
      <Link to="/">
        <Button className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
