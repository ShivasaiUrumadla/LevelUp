import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      
      return;
    }
    setError("");
    verify_signup(name,email,password);
    console.log("signup submit", { name, email, password });
  };

  const navigate = useNavigate();


  async function verify_signup(name,mail,pass){
    try{
      const response = await fetch("http://127.0.0.1:5000/signup",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          username:name,
          email:mail,
          password:pass
        })
      });
      if(!response.ok){
        throw new Error("Failed to update progress")
        
        }
        if (response.ok){
          const data=await response.json()
          localStorage.setItem("token",data.token)
         navigate("/")
        }
    }catch(error){
      console.log(`error creating account at fronted${error}`)
      setError(error)
    }
  }



  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start tracking your daily habits today.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Name <span className="normal-case text-muted-foreground/70"></span>
            </span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <User className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Email
            </span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Password
            </span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </label>
          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Confirm password
            </span>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </label>
          {error ? (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          ) : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create account
          </button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}