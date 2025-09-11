import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface UseNotFoundHooks {
  location: ReturnType<typeof useLocation>;
}

export function useNotFoundHooks(): UseNotFoundHooks {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return {
    location,
  };
}
