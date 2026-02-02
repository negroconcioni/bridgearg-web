import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { submitContact } from "@/lib/api";
import { Loader2 } from "lucide-react";

const ContactoPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContact(formData);
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo enviar el mensaje.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Page Header */}
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label block mb-4">Hablemos</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Contacto
              </h1>
              <p className="text-muted-foreground text-lg mt-6 max-w-xl">
                ¿Interesado en alguna obra? ¿Querés saber más sobre nuestros artistas? 
                Estamos aquí para ayudarte.
              </p>
            </div>
          </section>

          {/* Contact Form */}
          <section className="section-padded">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="tech-box">
                    <label className="text-technical text-foreground block mb-3">
                      Nombre
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      required
                      className="bg-transparent border-border focus:border-foreground"
                    />
                  </div>

                  <div className="tech-box">
                    <label className="text-technical text-foreground block mb-3">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      required
                      className="bg-transparent border-border focus:border-foreground"
                    />
                  </div>

                  <div className="tech-box">
                    <label className="text-technical text-foreground block mb-3">
                      Asunto
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Consulta sobre..."
                      required
                      className="bg-transparent border-border focus:border-foreground"
                    />
                  </div>

                  <div className="tech-box">
                    <label className="text-technical text-foreground block mb-3">
                      Mensaje
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tu mensaje..."
                      required
                      rows={5}
                      className="bg-transparent border-border focus:border-foreground resize-none"
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto" disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Enviando…
                      </>
                    ) : (
                      "Enviar Mensaje"
                    )}
                  </Button>
                </form>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="tech-box">
                    <h3 className="text-technical text-foreground mb-4">Email</h3>
                    <a href="mailto:info@bridgearg.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      info@bridgearg.com
                    </a>
                  </div>

                  <div className="tech-box">
                    <h3 className="text-technical text-foreground mb-4">Buenos Aires</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Palermo, Buenos Aires<br />
                      Argentina
                    </p>
                  </div>

                  <div className="tech-box">
                    <h3 className="text-technical text-foreground mb-4">New York</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Chelsea, New York<br />
                      United States
                    </p>
                  </div>

                  <div className="tech-box">
                    <h3 className="text-technical text-foreground mb-4">Redes</h3>
                    <div className="flex gap-4">
                      <a href="#" className="text-label hover:text-foreground transition-colors">
                        Instagram
                      </a>
                      <a href="#" className="text-label hover:text-foreground transition-colors">
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ContactoPage;
