import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { getSupabase } from "@/lib/supabaseClient";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdminClient";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { AdminLoteRow } from "@/features/admin/types";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `block border-l-2 py-2 pl-3 text-sm tracking-wide transition-colors ${
    isActive ? "border-[#faf9ef] bg-white/5 text-[#faf9ef]" : "border-transparent text-white/70 hover:text-[#faf9ef]"
  }`;

const sectionTitle = "mt-6 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40";

export function AdminSidebar() {
  const qc = useQueryClient();

  const { data: lotes = [] } = useQuery({
    queryKey: ["admin", "lotes"],
    queryFn: async () => {
      const sb = getSupabase();
      const { data, error } = await sb.from("lotes").select("id,nombre,fecha,created_at").order("id", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as AdminLoteRow[];
    },
  });

  const createLote = useMutation({
    mutationFn: async () => {
      const admin = getSupabaseAdmin();
      const nombre = `Nuevo lote ${new Date().toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}`;
      const { data, error } = await admin.from("lotes").insert({ nombre }).select("id").single();
      if (error) throw new Error(error.message);
      return data as { id: number };
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "lotes"] });
      toast({ title: "Lote creado" });
    },
    onError: (e: Error) => {
      toast({ title: "No se pudo crear el lote", description: e.message, variant: "destructive" });
    },
  });

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#1a1618] text-[#faf9ef] md:w-64">
      <div className="border-b border-white/10 px-4 py-5">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#faf9ef]">Bridgearg Admin</div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className={sectionTitle}>Catálogo</div>
        <NavLink to="/admin/obras" className={navClass} end>
          Obras
        </NavLink>
        <NavLink to="/admin/artistas" className={navClass}>
          Artistas
        </NavLink>

        <div className={sectionTitle}>Lotes</div>
        <ul className="space-y-0.5">
          {lotes.map((l) => (
            <li key={l.id}>
              <NavLink to={`/admin/lotes/${l.id}`} className={navClass}>
                {l.nombre}
              </NavLink>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full rounded-none border-white/25 bg-transparent text-[10px] uppercase tracking-wider text-[#faf9ef] hover:bg-white/10 hover:text-[#faf9ef]"
          disabled={!isSupabaseAdminConfigured() || createLote.isPending}
          onClick={() => createLote.mutate()}
        >
          <Plus className="h-3.5 w-3.5" />
          Nuevo lote
        </Button>

        <div className={sectionTitle}>Reportes</div>
        <NavLink to="/admin/resumen" className={navClass}>
          Resumen
        </NavLink>
      </nav>
    </aside>
  );
}
