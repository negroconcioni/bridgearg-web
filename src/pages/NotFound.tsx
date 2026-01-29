import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <span className="text-label block mb-4">Error</span>
          <h1 className="text-display text-8xl mb-4">404</h1>
          <p className="text-muted-foreground text-lg mb-8">Página no encontrada</p>
          <a 
            href="/" 
            className="text-technical border border-border px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
