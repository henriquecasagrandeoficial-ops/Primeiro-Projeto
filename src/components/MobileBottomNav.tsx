import { motion } from "framer-motion";
import { Heart, Home, MenuSquare, Trophy, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const items = [
  { label: "Início", href: "/cliente", icon: Home },
  { label: "Cardápio", href: "/cliente/cardapio", icon: MenuSquare },
  { label: "Votações", href: "/cliente/votacao", icon: Trophy },
  { label: "Favoritos", href: "/cliente/favoritos", icon: Heart },
  { label: "Perfil", href: "/cliente/perfil", icon: UserCircle },
];

export function MobileBottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <nav
        className="mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[1.6rem] border border-border/70 bg-card/85 p-1.5 shadow-elevated backdrop-blur-xl"
        aria-label="Navegação principal mobile"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/cliente"}
              className="relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[10.5px] font-medium"
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <motion.span
                      layoutId="bottomNavActive"
                      transition={{ type: "spring", stiffness: 450, damping: 34 }}
                      className="absolute inset-0 rounded-2xl bg-primary shadow-soft"
                    />
                  ) : null}
                  <Icon
                    className={cn(
                      "relative h-5 w-5 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "relative transition-colors",
                      isActive ? "font-semibold text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
