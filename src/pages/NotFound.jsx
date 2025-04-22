
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        
        {location.pathname.startsWith('/trip/') && (
          <div className="mb-6">
            <p className="text-gray-500 mb-2">
              The road trip you're looking for doesn't exist or has been removed.
              Try viewing trips from the Explore page instead.
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Technical info: The app now displays trip details directly on the Explore page
            </p>
          </div>
        )}
        
        <Button asChild className="bg-forest-700 hover:bg-forest-800">
          <Link to="/explore">Explore Road Trips</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
