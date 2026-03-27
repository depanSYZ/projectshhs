"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlayCircle, Copy, Check, RefreshCw, LogOut, Loader2,
  Key, User, Mail, Activity, Shield, Camera,
} from "lucide-react";
import Image from "next/image";

interface UserData {
  username: string;
  email:    string;
  avatar:   string;
  apikey:   string;
  plan:     string;
  requests: number;
  created:  string;
}

export default function ProfilePage() {
  const router           = useRouter();
  const fileRef          = useRef<HTMLInputElement>(null);
  const [user, setUser]  = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [regen,   setRegen]   = useState(false);
  const [msg,     setMsg]     = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPass,  setEditPass]  = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => { if (j.success) { setUser(j.user); setEditEmail(j.user.email); } else router.push("/auth/login"); })
      .finally(() => setLoading(false));
  }, [router]);

  const copyKey = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.apikey);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMsg("Ukuran foto maksimal 2MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSaving(true);
      const res  = await fetch("/api/auth/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: base64 }) });
      const json = await res.json();
      if (json.success) { setUser((u) => u ? { ...u, avatar: base64 } : u); setMsg("Foto diperbarui!"); }
      else setMsg(json.error ?? "Gagal update foto.");
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true); setMsg("");
    const body: Record<string, string> = {};
    if (editEmail !== user?.email) body.email = editEmail;
    if (editPass) body.password = editPass;
    if (Object.keys(body).length === 0) { setSaving(false); setMsg("Tidak ada perubahan."); return; }
    const res  = await fetch("/api/auth/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    if (json.success) { setUser((u) => u ? { ...u, ...body } : u); setMsg("Profil diperbarui!"); setEditPass(""); }
    else setMsg(json.error ?? "Gagal update profil.");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleRegenKey = async () => {
    if (!confirm("Yakin mau generate ulang API key? Key lama akan tidak aktif.")) return;
    setRegen(true);
    const res  = await fetch("/api/auth/regen-key", { method: "POST" });
    const json = await res.json();
    if (json.success) { setUser((u) => u ? { ...u, apikey: json.apikey } : u); setMsg("API key baru dibuat!"); }
    else setMsg(json.error ?? "Gagal generate key.");
    setRegen(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <PlayCircle className="h-7 w-7 text-primary" />
            <span>Snap<span className="text-muted-foreground">-Tok</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
            <Link href="/docs">
              <Button variant="outline" size="sm" className="gap-2">
                <Key className="h-3.5 w-3.5" />
                API Docs
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />Logout
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="container mx-auto max-w-3xl px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-muted overflow-hidden ring-2 ring-primary/20 shadow-xl">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.username} width={112} height={112} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors border-2 border-background"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold ${user.plan === "pro" ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400" : "bg-primary/5 border-primary/20 text-primary"}`}>
                  <Shield className="h-3 w-3" />
                  {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                  Bergabung sejak {new Date(user.created).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Stats card */}
            <div className="flex gap-4 sm:gap-6 rounded-2xl border border-border bg-background/80 backdrop-blur px-6 py-4 shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{user.requests.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Activity className="h-3 w-3" /> Requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-3xl px-4 py-8 space-y-5">

        {msg && (
          <div className={`rounded-xl p-4 text-sm font-medium border flex items-center gap-2 ${msg.includes("!") ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
            {msg.includes("!") ? <Check className="h-4 w-4 flex-shrink-0" /> : null}
            {msg}
          </div>
        )}

        {/* API Key */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5">
                <Key className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">API Key</span>
            </div>
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground">
                Lihat Docs <span aria-hidden>→</span>
              </Button>
            </Link>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-xl bg-muted px-4 py-3 text-sm font-mono text-foreground truncate border border-border">
                {user.apikey}
              </code>
              <Button variant="outline" size="icon" onClick={copyKey} className="flex-shrink-0 rounded-xl h-10 w-10">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Tambahkan <code className="bg-muted px-1.5 py-0.5 rounded-md">?apikey=YOUR_KEY</code> ke setiap request API.
              </p>
              <Button variant="ghost" size="sm" onClick={handleRegenKey} disabled={regen} className="text-destructive hover:text-destructive flex-shrink-0 text-xs gap-1.5">
                {regen ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Regenerate
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-sm">Edit Profil</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
              </label>
              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                type="email"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password Baru</label>
              <Input
                value={editPass}
                onChange={(e) => setEditPass(e.target.value)}
                type="password"
                placeholder="Kosongkan jika tidak ingin diganti"
                className="rounded-xl"
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="rounded-xl gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan...</> : "Simpan Perubahan"}
            </Button>
          </div>
        </div>

        {/* Account created */}
        <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Akun dibuat:{" "}
            <span className="font-medium text-foreground">
              {new Date(user.created).toLocaleDateString("id-ID", { dateStyle: "long" })}
            </span>
          </p>
          <Link href="/docs">
            <Button variant="outline" size="sm" className="text-xs rounded-xl gap-1.5">
              <Key className="h-3 w-3" /> API Docs
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
