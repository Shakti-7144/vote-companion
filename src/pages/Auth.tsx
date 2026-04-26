import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Vote, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate("/"); });
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Welcome back!" }); navigate("/"); }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/`, data: { display_name: name } },
    });
    setLoading(false);
    if (error) toast({ title: "Sign-up failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Account created", description: "You're signed in!" }); navigate("/"); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-hero text-primary-foreground p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 30% 20%, hsl(var(--accent)) 0%, transparent 40%)"
        }} />
        <Link to="/" className="relative flex items-center gap-2 font-display font-bold text-xl">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur"><Vote className="w-5 h-5" /></span>
          VoteSmart <span className="text-accent">AI</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-5xl font-bold leading-tight text-balance">Save your progress.<br />Vote with confidence.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md">Track quiz scores and pick up learning where you left off — across any device.</p>
        </div>
        <div />
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-muted-foreground mb-8">Sign in or create an account to save your progress.</p>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 mt-6">
                <div><Label htmlFor="si-email">Email</Label><Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label htmlFor="si-pw">Password</Label><Input id="si-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 mt-6">
                <div><Label htmlFor="su-name">Display name</Label><Input id="su-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><Label htmlFor="su-email">Email</Label><Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label htmlFor="su-pw">Password</Label><Input id="su-pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
          <p className="text-center text-sm text-muted-foreground mt-6"><Link to="/" className="hover:text-foreground">← Back to home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
