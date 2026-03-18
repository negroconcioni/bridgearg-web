import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { submitContact } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { SEO } from "@/components/SEO";

const ContactoPage = () => {
  const [searchParams] = useSearchParams();

  const obraParam = searchParams.get("obra");
  const artistaParam = searchParams.get("artista");
  const subjectParam = searchParams.get("subject");

  const normalizedSubjectParam =
    subjectParam &&
    ["Artwork inquiry", "Artist inquiry", "General inquiry", "Press"].includes(
      subjectParam,
    )
      ? subjectParam
      : "";

  const initialSubject = normalizedSubjectParam
    ? normalizedSubjectParam
    : obraParam
      ? "Artwork inquiry"
      : artistaParam
        ? "Artist inquiry"
        : "";

  const initialMessage = obraParam
    ? `I'm interested in the work: ${obraParam}`
    : artistaParam
      ? `I'd like to know more about: ${artistaParam}`
      : "";

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    subject?: string;
    message: string;
  }>({
    name: "",
    email: "",
    subject: initialSubject || undefined,
    message: initialMessage,
  });
  const [sending, setSending] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: {
      name: string;
      email: string;
      subject: string;
      message: string;
    } = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    if (!formData.name.trim()) {
      nextErrors.name = "This field is required";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "This field is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "This field is required";
    }

    if (!formData.subject) {
      nextErrors.subject = "Please select a subject";
    }

    const hasErrorsAfterSubject = Object.values(nextErrors).some(Boolean);
    if (hasErrorsAfterSubject) {
      setErrors(nextErrors);
      return;
    }
    setSending(true);
    try {
      await submitContact({ ...formData, subject: formData.subject! });
      toast({
        title: "Message sent",
        description: "Thank you for your inquiry. We will respond shortly.",
      });
      setFormSent(true);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not send your message.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEO
          title="Contact"
          description="Get in touch with BridgeArg for artist inquiries, acquisitions, and more."
          url="/contacto"
        />
        <Header />
        <main>
          {/* Page Header */}
          <section className="section-padded border-b border-border">
            <div className="container mx-auto">
              <span className="text-label block mb-4">Get in Touch</span>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl">
                Get in Touch
              </h1>
              <p className="text-muted-foreground text-lg mt-6 max-w-xl">
                Interested in a work? Would you like to know more about our artists?
                We are here to help.
              </p>
            </div>
          </section>

          {/* Contact Form */}
          <section className="section-padded">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Form / Success state */}
                {formSent ? (
                  <div className="space-y-6 rounded-lg border border-border bg-card/40 p-8">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-xl">
                      ✓
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-foreground">Message sent</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        We'll get back to you within 24 hours. Thank you for reaching out to BridgeArg.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          name: "",
                          email: "",
                          subject: initialSubject || undefined,
                          message: initialMessage,
                        });
                        setFormSent(false);
                      }}
                      className="text-label mt-4 underline underline-offset-4 hover:text-foreground"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="tech-box">
                      <label
                        htmlFor="name"
                        className="text-technical text-foreground mb-3 block"
                      >
                        NAME
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) {
                            setErrors({ ...errors, name: "" });
                          }
                        }}
                        placeholder="Your name"
                        required
                        className="border-border bg-transparent focus:border-foreground"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="tech-box">
                      <label
                        htmlFor="email"
                        className="text-technical text-foreground mb-3 block"
                      >
                        EMAIL
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) {
                            setErrors({ ...errors, email: "" });
                          }
                        }}
                        placeholder="your@email.com"
                        required
                        className="border-border bg-transparent focus:border-foreground"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="tech-box">
                      <label
                        htmlFor="subject"
                        className="text-technical text-foreground mb-3 block"
                      >
                        SUBJECT
                      </label>
                      <input
                        type="hidden"
                        name="subject"
                        value={formData.subject ?? ""}
                        readOnly
                        aria-hidden
                      />
                      <Select
                        value={formData.subject}
                      onValueChange={(value) => {
                        setFormData({ ...formData, subject: value });
                        if (errors.subject) {
                          setErrors({ ...errors, subject: "" });
                        }
                      }}
                      >
                        <SelectTrigger
                          id="subject"
                          aria-required="true"
                          className="border-border bg-transparent focus:border-foreground"
                        >
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Artwork inquiry">Artwork inquiry</SelectItem>
                          <SelectItem value="Artist inquiry">Artist inquiry</SelectItem>
                          <SelectItem value="General inquiry">General inquiry</SelectItem>
                          <SelectItem value="Press">Press</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="mt-1 text-xs text-destructive">{errors.subject}</p>
                      )}
                    </div>

                    <div className="tech-box">
                      <label
                        htmlFor="message"
                        className="text-technical text-foreground mb-3 block"
                      >
                        MESSAGE
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) {
                            setErrors({ ...errors, message: "" });
                          }
                        }}
                        placeholder="Your message..."
                        required
                        rows={5}
                        className="min-h-[160px] resize-y border-border bg-transparent focus:border-foreground"
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className={`w-full md:w-auto ${sending ? "cursor-not-allowed opacity-70" : ""}`}
                      disabled={sending}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}

                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="tech-box">
                    <h3 className="text-technical text-foreground mb-4">Email</h3>
                    <a href="mailto:info@bridgearg.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      info@bridgearg.com
                    </a>
                  </div>

                  {/* ⚠️ TODO: Reemplazar href y texto con el número de WhatsApp real del negocio */}
                  <div className="tech-box">
                    <h3 className="text-technical text-foreground mb-4">WHATSAPP</h3>
                    <a
                      href="https://wa.me/5491100000000"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      +54 9 11 0000 0000
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
                    <h3 className="text-technical text-foreground mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                      {/* TODO: Reemplazar con URLs reales de Instagram y LinkedIn */}
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
