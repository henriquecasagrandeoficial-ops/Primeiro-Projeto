import { MessageCircle } from "lucide-react";
import { emptySettings, useSettings } from "@/hooks/useSettings";
import { useAppStore } from "@/store/appStore";

export function FloatingWhatsApp() {
  const { data: settings = emptySettings } = useSettings();
  const trackSocialClick = useAppStore((state) => state.trackSocialClick);

  return (
    <a
      href={settings.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-24 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 md:bottom-6"
      onClick={() => trackSocialClick("whatsapp")}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Fale conosco</span>
    </a>
  );
}
