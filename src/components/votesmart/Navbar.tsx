import { Link, NavLink, useNavigate } from "react-router-dom";
import { Vote, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegionPicker } from "./RegionPicker";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/timeline", label: "Timeline" },
  { to: "/elections", label: "Elections" },
  { to: "/parties", label: "Parties" },
  { to: "/candidates", label: "Candidates" },
  { to: "/quiz", label: "Quiz" },
  { to: "/chat", label: "Ask AI" },
];

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-hero text-primary-foreground shadow-glow">
            <Vote className="w-5 h-5" />
          </span>
          VoteSmart <span className="text-accent">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-accent" : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <RegionPicker />
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/auth"><UserIcon className="w-4 h-4 mr-1" /> Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
