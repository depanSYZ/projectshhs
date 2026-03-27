"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlayCircle, FileText, Zap, Globe, Lock, Key, Copy, Check,
  LogOut, User, ChevronRight, Search, Download, ArrowRight,
  Loader2, Terminal, BookOpen, Code2, Sparkles, Shield,
  ChevronDown, ExternalLink, Activity, AlertTriangle, Package,
  Repeat, Image, Music, Film, Hash, Clock, TrendingUp, Cpu,
  Layers, Link2, Database, Info, CheckCircle2, XCircle,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t } from "@/lib/i18n";

const BASE = "https://api.snaptok.my.id";

interface UserData { username: string; email: string; avatar: string; apikey: string; plan: string; requests: number; }

export default function DocsPage() {
  const router            = useRouter();
  const { lang }          = useLang();
  const [user, setUser]   = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((j) => {
      if (j.success) setUser(j.user);
      else router.push("/auth/login?from=/docs");
    }).finally(() => setLoading(false));
  }, [router]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
  if (!user) return null;

  const userKey = user.apikey;

  const sections = [
    { id: "overview",    label: "Overview",         icon: BookOpen },
    { id: "auth",        label: "Authentication",    icon: Key },
    { id: "download",    label: "Download API",      icon: Download },
    { id: "search",      label: "Search API",        icon: Search },
    { id: "proxy",       label: "Proxy Endpoint",    icon: Link2 },
    { id: "ratelimit",   label: "Rate Limits",       icon: Activity },
    { id: "sdk",         label: "SDK & Examples",    icon: Package },
    { id: "errors",      label: "Error Codes",       icon: Lock },
    { id: "changelog",   label: "Changelog",         icon: Hash },
  ];

  const CodeBlock = ({ code, id, lang: codeLang }: { code: string; id: string; lang?: string }) => (
    <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
      {codeLang && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
          <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{codeLang}</span>
          <button onClick={() => copy(code, id)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            {copied === id ? <><Check className="h-3 w-3 text-green-400" /><span className="text-green-400">Copied</span></> : <><Copy className="h-3 w-3" />Copy</>}
          </button>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 text-sm overflow-x-auto leading-relaxed text-zinc-300 font-mono">
          <code>{code}</code>
        </pre>
        {!codeLang && (
          <button onClick={() => copy(code, id)}
            className="absolute top-3 right-3 rounded-lg bg-white/10 hover:bg-white/20 p-1.5 opacity-0 group-hover:opacity-100 transition-all">
            {copied === id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
          </button>
        )}
      </div>
    </div>
  );

  const ParamTable = ({ rows, cols }: { rows: string[][], cols: string[] }) => (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {cols.map((c) => <th key={c} className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`py-3 px-4 ${j === 0 ? "font-mono text-xs text-primary font-medium" : j === 1 ? "" : "text-muted-foreground text-xs"}`}>
                  {j === 1 ? (
                    <Badge variant={cell === "Ya" || cell === "Required" ? "destructive" : "secondary"} className="text-xs">{cell}</Badge>
                  ) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const SectionHeader = ({ title, desc, badge }: { title: string; desc: string; badge?: string }) => (
    <div className="mb-8 pb-6 border-b border-border">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        {badge && <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30">{badge}</Badge>}
      </div>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );

  const InfoBox = ({ type, title, children }: { type: "info" | "warning" | "success" | "danger"; title: string; children: React.ReactNode }) => {
    const styles = {
      info:    { border: "border-blue-500/30",   bg: "bg-blue-500/5",   icon: Info,          iconColor: "text-blue-500",          titleColor: "text-blue-600 dark:text-blue-400" },
      warning: { border: "border-amber-500/30",  bg: "bg-amber-500/5",  icon: AlertTriangle, iconColor: "text-amber-500",         titleColor: "text-amber-600 dark:text-amber-400" },
      success: { border: "border-green-500/30",  bg: "bg-green-500/5",  icon: CheckCircle2,  iconColor: "text-green-500",         titleColor: "text-green-600 dark:text-green-400" },
      danger:  { border: "border-red-500/30",    bg: "bg-red-500/5",    icon: XCircle,       iconColor: "text-red-500",           titleColor: "text-red-600 dark:text-red-400" },
    };
    const s = styles[type];
    const Icon = s.icon;
    return (
      <div className={`rounded-xl border ${s.border} ${s.bg} p-4 flex gap-3`}>
        <Icon className={`h-4 w-4 ${s.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="text-sm">
          <p className={`font-medium ${s.titleColor} mb-0.5`}>{title}</p>
          <div className="text-muted-foreground text-xs">{children}</div>
        </div>
      </div>
    );
  };

  const EndpointBadge = ({ method }: { method: "GET" | "POST" | "DELETE" }) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500",
      POST: "bg-green-500",
      DELETE: "bg-red-500",
    };
    return <Badge className={`${colors[method]} text-white text-xs px-2 py-0.5 rounded`}>{method}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <PlayCircle className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Snap<span className="text-muted-foreground font-normal">tok</span></span>
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-sm">API Docs</span>
              <Badge variant="secondary" className="text-xs ml-1">v3</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <Link href="/auth/profile">
              <Button variant="ghost" size="sm" className="gap-2 h-8 text-xs">
                <div className="h-5 w-5 rounded-full bg-primary/15 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span className="hidden sm:inline">{user.username}</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-6 max-w-6xl">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
          <div className="sticky top-[88px] space-y-1">

            {/* API Key card */}
            <div className="mb-4 rounded-xl border border-border bg-muted/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">API Key</span>
                <Badge variant="secondary" className="text-xs capitalize">{user.plan}</Badge>
              </div>
              <code className="block text-xs font-mono text-foreground/80 break-all leading-relaxed">{userKey}</code>
              <button onClick={() => copy(userKey, "sidebar-key")}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs rounded-lg bg-background border border-border py-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                {copied === "sidebar-key"
                  ? <><Check className="h-3 w-3 text-green-500" /><span className="text-green-500">Copied!</span></>
                  : <><Copy className="h-3 w-3" />Copy key</>}
              </button>
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">Navigation</p>
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all text-left ${
                    activeSection === s.id
                      ? "bg-primary text-primary-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  {s.label}
                </button>
              );
            })}

            <div className="pt-3">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                <ExternalLink className="h-3 w-3" />Back to App
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <div className="rounded-2xl border border-border bg-background/95 backdrop-blur shadow-xl p-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium">
              <span className="flex items-center gap-2">
                {(() => { const s = sections.find(s => s.id === activeSection); const Icon = s?.icon ?? BookOpen; return <Icon className="h-4 w-4" />; })()}
                {sections.find(s => s.id === activeSection)?.label}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
            </button>
            {sidebarOpen && (
              <div className="mt-1 border-t border-border pt-1 flex flex-col gap-0.5">
                {sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button key={s.id} onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                        activeSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                      }`}>
                      <Icon className="h-3.5 w-3.5" />{s.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-32 lg:pb-8">

          {/* ── Overview ── */}
          {activeSection === "overview" && (
            <section className="space-y-6">
              <SectionHeader title="API Documentation" desc="REST API untuk download video TikTok & Douyin dan pencarian video tanpa watermark. Semua response dalam format JSON." />

              {/* Stats */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Zap,      title: "REST API",       desc: "Simple HTTP GET",         color: "text-amber-500",  bg: "bg-amber-500/10" },
                  { icon: Globe,    title: "2 Platform",     desc: "TikTok & Douyin",          color: "text-blue-500",   bg: "bg-blue-500/10" },
                  { icon: Shield,   title: "API Key Auth",   desc: "Format snp-xxxxx",         color: "text-green-500",  bg: "bg-green-500/10" },
                  { icon: Activity, title: "99.9% Uptime",   desc: "SLA guaranteed",           color: "text-purple-500", bg: "bg-purple-500/10" },
                  { icon: Clock,    title: "< 500ms",        desc: "Rata-rata response time",  color: "text-rose-500",   bg: "bg-rose-500/10" },
                  { icon: Database, title: "No Watermark",   desc: "Video bersih tanpa logo",  color: "text-cyan-500",   bg: "bg-cyan-500/10" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-xl border border-border p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                      <div className={`rounded-lg ${item.bg} p-2.5 flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Base URL */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base URL</span>
                </div>
                <div className="p-4">
                  <CodeBlock code={BASE} id="base-url" />
                </div>
              </div>

              {/* Quick nav cards */}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: "download",  label: "Download API",   desc: "Download video TikTok & Douyin tanpa watermark",  icon: Download,  badge: null },
                  { id: "search",    label: "Search API",     desc: "Cari video TikTok berdasarkan keyword",            icon: Search,    badge: "NEW" },
                  { id: "proxy",     label: "Proxy Endpoint", desc: "Stream file video/audio langsung ke client",       icon: Link2,     badge: null },
                  { id: "ratelimit", label: "Rate Limits",    desc: "Batas request berdasarkan plan kamu",              icon: Activity,  badge: null },
                  { id: "sdk",       label: "SDK & Examples", desc: "Contoh kode JavaScript, Python, PHP, cURL",        icon: Package,   badge: null },
                  { id: "errors",    label: "Error Codes",    desc: "Format error dan kode status HTTP",                icon: Lock,      badge: null },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setActiveSection(item.id)}
                      className="group flex items-center gap-4 rounded-xl border border-border p-4 hover:bg-muted/40 hover:border-primary/30 transition-all text-left">
                      <div className="rounded-lg bg-primary/10 p-2.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{item.label}</p>
                          {item.badge && <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 text-xs">{item.badge}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* API key callout */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">API key kamu sudah aktif</p>
                  <code className="text-xs font-mono text-muted-foreground break-all">{userKey}</code>
                  <p className="text-xs text-muted-foreground mt-1">Plan: <span className="capitalize font-medium text-foreground">{user.plan}</span> · Requests used: <span className="font-medium text-foreground">{user.requests.toLocaleString()}</span></p>
                </div>
                <button onClick={() => copy(userKey, "overview-key")}
                  className="flex-shrink-0 rounded-lg bg-primary/10 hover:bg-primary/20 p-1.5 transition-colors">
                  {copied === "overview-key" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-primary" />}
                </button>
              </div>

              {/* What you can do */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Apa yang bisa dilakukan</span>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { icon: Film,  color: "text-blue-500",   bg: "bg-blue-500/10",   title: "Download Video TikTok",  desc: "Video HD, SD, dan versi watermark. Support URL pendek (vt.tiktok.com) dan panjang." },
                    { icon: Image, color: "text-purple-500", bg: "bg-purple-500/10", title: "Download Slideshow/Foto", desc: "Jika video berupa kumpulan foto, API akan mengembalikan array URL gambar." },
                    { icon: Music, color: "text-green-500",  bg: "bg-green-500/10",  title: "Extract Audio MP3",      desc: "Ambil audio dari video TikTok atau Douyin dalam format MP3 via proxy." },
                    { icon: Film,  color: "text-rose-500",   bg: "bg-rose-500/10",   title: "Download Video Douyin",  desc: "Platform TikTok versi China. Support semua format video Douyin." },
                    { icon: Search,color: "text-amber-500",  bg: "bg-amber-500/10",  title: "Cari Video TikTok",      desc: "Cari berdasarkan keyword dengan pagination, max 50 hasil per request." },
                    { icon: Link2, color: "text-cyan-500",   bg: "bg-cyan-500/10",   title: "Proxy Stream",           desc: "Stream file langsung ke browser tanpa CORS issue. Cocok untuk download manager." },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 px-4 py-3.5 hover:bg-muted/20 transition-colors">
                        <div className={`rounded-lg ${item.bg} p-2 mt-0.5 flex-shrink-0`}>
                          <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ── Authentication ── */}
          {activeSection === "auth" && (
            <section className="space-y-5">
              <SectionHeader title="Authentication" desc="Semua endpoint v3 membutuhkan API key. Tambahkan key ke setiap request sebagai query param atau HTTP header." />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your API Key</span>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">{user.plan}</Badge>
                </div>
                <div className="p-4">
                  <CodeBlock code={userKey} id="auth-key" />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method 1 — Query Parameter (Paling Mudah)</p>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Tambahkan <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">apikey</code> langsung di URL. Cocok untuk testing cepat.</p>
                  <CodeBlock code={`${BASE}/api/v3/download?platform=tiktok&url=...&apikey=${userKey}`} id="auth-query" />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method 2 — HTTP Header (Lebih Aman)</p>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Kirim key via header <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">X-API-Key</code>. Direkomendasikan untuk production agar key tidak terlihat di URL log.</p>
                  <CodeBlock lang="javascript" id="auth-header" code={`fetch("${BASE}/api/v3/download?platform=tiktok&url=...", {
  headers: {
    "X-API-Key": "${userKey}"
  }
})`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Format API Key</p>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["Field", "Value", "Keterangan"]}
                    rows={[
                      ["Prefix",  "-",    "Semua key diawali dengan snp-"],
                      ["Length",  "-",    "Total 32 karakter termasuk prefix"],
                      ["Charset", "-",    "Alphanumerik lowercase"],
                      ["Case",    "-",    "Case-sensitive, jangan ubah huruf besar/kecil"],
                    ]}
                  />
                </div>
              </div>

              <InfoBox type="warning" title="Jaga kerahasiaan API key kamu">
                Jangan expose API key di client-side code yang public. Gunakan environment variables atau backend proxy agar key tidak bisa dibaca user.
              </InfoBox>

              <InfoBox type="info" title="Rotate API Key">
                Jika key kamu bocor, kamu bisa generate ulang dari halaman Profile. Key lama akan langsung non-aktif.
              </InfoBox>
            </section>
          )}

          {/* ── Download API ── */}
          {activeSection === "download" && (
            <section className="space-y-5">
              <SectionHeader title="Download API" desc="Download video TikTok atau Douyin tanpa watermark, termasuk audio MP3 dan slideshow foto." />

              {/* Endpoint */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-3">
                  <EndpointBadge method="GET" />
                  <code className="text-sm font-mono text-foreground">/api/v3/download</code>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["Parameter", "Wajib", "Keterangan"]}
                    rows={[
                      ["platform", "Ya",    "tiktok atau douyin"],
                      ["url",      "Ya",    "URL video yang valid (encode dengan encodeURIComponent)"],
                      ["apikey",   "Ya",    "API key kamu (format snp-xxx)"],
                    ]}
                  />
                </div>
              </div>

              {/* TikTok Request */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎵</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TikTok — Request</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">Support URL format pendek (<code className="bg-muted px-1 rounded">vt.tiktok.com</code>) maupun panjang (<code className="bg-muted px-1 rounded">tiktok.com/@user/video/xxx</code>).</p>
                  <CodeBlock id="dl-tiktok-url" code={`${BASE}/api/v3/download?platform=tiktok&url=https://vt.tiktok.com/xxx&apikey=${userKey}`} />
                  <CodeBlock lang="javascript" id="dl-tiktok-js" code={`const res = await fetch(
  \`${BASE}/api/v3/download?platform=tiktok&url=\${encodeURIComponent(url)}&apikey=${userKey}\`
);
const { data } = await res.json();

console.log(data.download.video_hd);    // URL video HD (tanpa watermark)
console.log(data.download.video_sd);    // URL video SD (tanpa watermark)
console.log(data.download.video_watermark); // URL video dengan watermark
console.log(data.download.audio);       // URL audio MP3
console.log(data.download.images);      // Array foto (jika slideshow, bukan null)`} />
                </div>
              </div>

              {/* TikTok Response */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎵</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TikTok — Response (Video)</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="dl-tiktok-res" code={`{
  "success": true,
  "platform": "tiktok",
  "data": {
    "id": "7234567890123456789",
    "title": "Judul video TikTok kamu disini...",
    "cover": "https://p16-sign.tiktokcdn-us.com/...",
    "duration": 30,
    "author": {
      "nickname": "User Display Name",
      "unique_id": "username_tiktok",
      "avatar": "https://p16-sign.tiktokcdn-us.com/..."
    },
    "stats": {
      "play": 1200000,
      "likes": 58000,
      "comment": 3200,
      "share": 1500
    },
    "music": {
      "title": "Nama Lagu - Artis",
      "author": "Nama Artis"
    },
    "download": {
      "video_hd": "/api/v3/proxy?url=...&token=...",
      "video_sd": "/api/v3/proxy?url=...&token=...",
      "video_watermark": "/api/v3/proxy?url=...&token=...",
      "audio": "/api/v3/proxy?url=...&token=...",
      "images": null
    }
  }
}`} />
                </div>
              </div>

              {/* TikTok Response Slideshow */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🖼️</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TikTok — Response (Slideshow/Foto)</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">Jika konten berupa slideshow foto (bukan video), field <code className="bg-muted px-1 rounded">images</code> akan berisi array URL gambar dan <code className="bg-muted px-1 rounded">video_hd/video_sd</code> bisa <code className="bg-muted px-1 rounded">null</code>.</p>
                  <CodeBlock lang="json" id="dl-tiktok-slide" code={`{
  "success": true,
  "platform": "tiktok",
  "data": {
    "id": "7234567890123456789",
    "title": "Caption slideshow...",
    "cover": "https://...",
    "duration": 0,
    "author": { "nickname": "...", "unique_id": "...", "avatar": "..." },
    "stats": { "play": 0, "likes": 2000, "comment": 100, "share": 50 },
    "music": { "title": "...", "author": "..." },
    "download": {
      "video_hd": null,
      "video_sd": null,
      "video_watermark": null,
      "audio": "/api/v3/proxy?url=...&token=...",
      "images": [
        "https://p16-sign.tiktokcdn-us.com/foto1.jpg",
        "https://p16-sign.tiktokcdn-us.com/foto2.jpg",
        "https://p16-sign.tiktokcdn-us.com/foto3.jpg"
      ]
    }
  }
}`} />
                </div>
              </div>

              {/* Douyin */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎬</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Douyin — Request</span>
                </div>
                <div className="p-4 space-y-3">
                  <CodeBlock id="dl-dy-url" code={`${BASE}/api/v3/download?platform=douyin&url=https://www.douyin.com/video/xxx&apikey=${userKey}`} />
                  <CodeBlock lang="javascript" id="dl-dy-js" code={`const res = await fetch(
  \`${BASE}/api/v3/download?platform=douyin&url=\${encodeURIComponent(url)}&apikey=${userKey}\`
);
const json = await res.json();
if (json.success) {
  const { download } = json.data;
  window.open(download.video_hd || download.video, "_blank");
}`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🎬</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Douyin — Response</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="dl-dy-res" code={`{
  "success": true,
  "platform": "douyin",
  "data": {
    "id": "7234567890123456789",
    "title": "Judul video Douyin...",
    "cover": "https://p3-pc.douyinpic.com/...",
    "duration": 30,
    "author": {
      "nickname": "用户名",
      "unique_id": "douyin_id",
      "avatar": "https://..."
    },
    "stats": { "play": 0, "likes": 0, "comment": 0, "share": 0 },
    "music": { "title": "...", "author": "..." },
    "download": {
      "video": "/api/v3/proxy?url=...&token=...",
      "video_hd": "/api/v3/proxy?url=...&token=...",
      "audio": "/api/v3/proxy?url=...&token=...",
      "images": null
    }
  }
}`} />
                </div>
              </div>

              <InfoBox type="info" title="Tips: Cek tipe konten sebelum download">
                Selalu cek apakah <code>images</code> bernilai <code>null</code> atau array. Jika array, tampilkan galeri foto. Jika <code>null</code>, gunakan URL video.
              </InfoBox>
            </section>
          )}

          {/* ── Search API ── */}
          {activeSection === "search" && (
            <section className="space-y-5">
              <SectionHeader title="Search API" desc="Cari video TikTok berdasarkan keyword, lengkap dengan link download dan data engagement." badge="NEW" />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-3">
                  <EndpointBadge method="GET" />
                  <code className="text-sm font-mono text-foreground">/api/v3/tiktok/search</code>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["Parameter", "Default", "Keterangan"]}
                    rows={[
                      ["q",      "—",   "Keyword pencarian (wajib). URL-encode spasi dan karakter khusus."],
                      ["count",  "20",  "Jumlah video per halaman. Maksimum 50."],
                      ["cursor", "0",   "Offset untuk pagination. Ambil dari field cursor di response sebelumnya."],
                      ["apikey", "—",   "API key kamu (wajib)"],
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request Basic</p>
                </div>
                <div className="p-4 space-y-3">
                  <CodeBlock id="search-url" code={`${BASE}/api/v3/tiktok/search?q=funny+cats&count=20&apikey=${userKey}`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request + Pagination (JavaScript)</p>
                </div>
                <div className="p-4 space-y-3">
                  <CodeBlock lang="javascript" id="search-js" code={`async function searchTikTok(keyword, maxPages = 3) {
  const results = [];
  let cursor = 0;

  for (let page = 0; page < maxPages; page++) {
    const res = await fetch(
      \`${BASE}/api/v3/tiktok/search?q=\${encodeURIComponent(keyword)}&count=20&cursor=\${cursor}&apikey=${userKey}\`
    );
    const json = await res.json();
    if (!json.success) break;

    results.push(...json.videos);
    if (!json.has_more) break;
    cursor = json.cursor;
  }

  return results;
}

const videos = await searchTikTok("funny cats");
videos.forEach(v => {
  console.log(v.title, v.stats.play);
  console.log("HD:", v.download.video_hd);
  console.log("Audio:", v.download.audio);
});`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="search-res" code={`{
  "success": true,
  "query": "funny cats",
  "count": 20,
  "cursor": 20,
  "has_more": true,
  "videos": [
    {
      "id": "7234567890123456789",
      "title": "Kucing lucu banget 😂 #funnycat #viral",
      "cover": "https://p16-sign.tiktokcdn-us.com/...",
      "duration": 15,
      "author": {
        "nickname": "Cat Lover ID",
        "unique_id": "catlover_id",
        "avatar": "https://..."
      },
      "stats": {
        "play": 500000,
        "likes": 25000,
        "comment": 1200,
        "share": 800
      },
      "download": {
        "video_hd": "https://api.snaptok.my.id/api/v3/proxy?url=...",
        "video_sd": "https://api.snaptok.my.id/api/v3/proxy?url=...",
        "video_watermark": "https://api.snaptok.my.id/api/v3/proxy?url=...",
        "audio": "https://api.snaptok.my.id/api/v3/proxy?url=..."
      }
    }
  ]
}`} />
                </div>
              </div>

              <InfoBox type="info" title="Pagination">
                Cek field <code>has_more</code>. Jika <code>true</code>, kirim request berikutnya dengan <code>cursor</code> dari response. Cursor bersifat opaque, jangan dimodifikasi.
              </InfoBox>

              <InfoBox type="warning" title="Encoding keyword">
                Selalu gunakan <code>encodeURIComponent()</code> untuk keyword yang mengandung spasi, emoji, atau karakter non-ASCII. Contoh: <code>encodeURIComponent("kucing lucu 😂")</code>
              </InfoBox>
            </section>
          )}

          {/* ── Proxy Endpoint ── */}
          {activeSection === "proxy" && (
            <section className="space-y-5">
              <SectionHeader title="Proxy Endpoint" desc="Stream file video atau audio langsung ke browser. Digunakan untuk bypass CORS dan menyajikan file dari CDN TikTok/Douyin." />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-3">
                  <EndpointBadge method="GET" />
                  <code className="text-sm font-mono text-foreground">/api/v3/proxy</code>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["Parameter", "Wajib", "Keterangan"]}
                    rows={[
                      ["url",   "Ya",   "URL CDN yang di-encode. Didapat dari field download di response Download/Search API."],
                      ["token", "Ya",   "Token satu kali pakai yang di-embed di URL proxy. Sudah auto-include di response."],
                    ]}
                  />
                </div>
              </div>

              <InfoBox type="info" title="URL Proxy sudah otomatis tersedia">
                Kamu tidak perlu membuat URL proxy sendiri. Field <code>download.video_hd</code>, <code>download.audio</code>, dll. sudah berupa URL proxy yang siap pakai langsung di <code>{"<a href>"}</code> atau <code>{"<video src>"}</code>.
              </InfoBox>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contoh Penggunaan — HTML Video Player</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="html" id="proxy-html" code={`<!-- Setelah dapat response dari Download API -->
<video controls width="360">
  <source src="https://api.snaptok.my.id/api/v3/proxy?url=...&token=..." type="video/mp4" />
</video>

<!-- Tombol download langsung -->
<a
  href="https://api.snaptok.my.id/api/v3/proxy?url=...&token=..."
  download="video.mp4"
>
  Download Video
</a>`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contoh Penggunaan — Fetch & Save (Node.js)</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="javascript" id="proxy-node" code={`import fs from "fs";
import fetch from "node-fetch";

async function downloadVideo(proxyUrl, filename) {
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

  const buffer = await res.buffer();
  fs.writeFileSync(filename, buffer);
  console.log(\`Saved: \${filename} (\${buffer.length} bytes)\`);
}

// Gunakan URL dari field download.video_hd
const { data } = await (await fetch(
  \`${BASE}/api/v3/download?platform=tiktok&url=\${encodeURIComponent(url)}&apikey=${userKey}\`
)).json();

await downloadVideo(data.download.video_hd, "output.mp4");
await downloadVideo(data.download.audio, "audio.mp3");`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response Headers yang Dikembalikan</p>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["Header", "Value", "Keterangan"]}
                    rows={[
                      ["Content-Type",        "video/mp4 / audio/mpeg", "Tergantung jenis file"],
                      ["Content-Disposition", "attachment; filename=...", "Trigger download otomatis di browser"],
                      ["Content-Length",      "integer",                 "Ukuran file dalam bytes"],
                      ["Access-Control-Allow-Origin", "*",               "CORS diizinkan dari semua origin"],
                    ]}
                  />
                </div>
              </div>

              <InfoBox type="warning" title="Token proxy bersifat sementara">
                URL proxy memiliki expiry. Jangan cache URL proxy lebih dari 1 jam. Selalu fetch ulang dari Download API untuk mendapatkan URL segar.
              </InfoBox>

              <InfoBox type="danger" title="Domain restriction">
                Proxy endpoint hanya bisa diakses dari domain yang terdaftar di dashboard. Request dari domain lain akan mendapat error <code>403 Forbidden</code>.
              </InfoBox>
            </section>
          )}

          {/* ── Rate Limits ── */}
          {activeSection === "ratelimit" && (
            <section className="space-y-5">
              <SectionHeader title="Rate Limits" desc="Batas jumlah request per menit dan per bulan berdasarkan plan kamu. Semua limit dihitung per API key." />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Limit per Plan</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        {["Plan", "Req / Menit", "Req / Hari", "Req / Bulan", "Fitur"].map((c) => (
                          <th key={c} className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { plan: "Free",       rpm: "10",     rpd: "500",      rpm2: "5.000",    features: "Download + Search",              color: "text-zinc-500" },
                        { plan: "Basic",      rpm: "30",     rpd: "2.000",    rpm2: "30.000",   features: "Download + Search + Proxy",      color: "text-blue-500" },
                        { plan: "Pro",        rpm: "100",    rpd: "10.000",   rpm2: "150.000",  features: "Semua fitur + Priority queue",   color: "text-purple-500" },
                        { plan: "Business",   rpm: "500",    rpd: "50.000",   rpm2: "Unlimited", features: "Semua fitur + Dedicated support", color: "text-amber-500" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className={`py-3 px-4 font-semibold text-sm ${row.color}`}>{row.plan}</td>
                          <td className="py-3 px-4 font-mono text-xs">{row.rpm}</td>
                          <td className="py-3 px-4 font-mono text-xs">{row.rpd}</td>
                          <td className="py-3 px-4 font-mono text-xs">{row.rpm2}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">{row.features}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rate Limit Headers</p>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Setiap response menyertakan header berikut untuk monitoring sisa kuota:</p>
                  <ParamTable
                    cols={["Header", "Contoh Value", "Keterangan"]}
                    rows={[
                      ["X-RateLimit-Limit",     "100",    "Batas request per menit untuk plan kamu"],
                      ["X-RateLimit-Remaining", "87",     "Sisa request yang tersedia di window saat ini"],
                      ["X-RateLimit-Reset",     "1703123456", "Unix timestamp kapan limit di-reset"],
                      ["X-Quota-Used",          "1250",   "Total request yang sudah digunakan bulan ini"],
                      ["X-Quota-Limit",         "150000", "Batas total request per bulan plan kamu"],
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Handling Rate Limit (429 Too Many Requests)</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="javascript" id="ratelimit-js" code={`async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch(url);

    if (res.status === 429) {
      const reset = res.headers.get("X-RateLimit-Reset");
      const waitMs = reset
        ? (parseInt(reset) * 1000) - Date.now()
        : 60 * 1000; // default tunggu 1 menit

      console.log(\`Rate limited. Retry in \${Math.ceil(waitMs / 1000)}s...\`);
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }

    return res.json();
  }
  throw new Error("Max retries exceeded");
}

const data = await fetchWithRetry(
  \`${BASE}/api/v3/download?platform=tiktok&url=\${encodeURIComponent(url)}&apikey=${userKey}\`
);`} />
                </div>
              </div>

              <InfoBox type="warning" title="Jangan spam request">
                Jika kamu mendeteksi <code>X-RateLimit-Remaining: 0</code>, hentikan request dan tunggu hingga window berikutnya. Request yang melewati limit akan langsung mendapat <code>429</code>.
              </InfoBox>

              <InfoBox type="success" title="Upgrade plan">
                Butuh limit lebih tinggi? Upgrade plan dari halaman <Link href="/pricing" className="underline">Pricing</Link> atau hubungi support untuk custom quota.
              </InfoBox>
            </section>
          )}

          {/* ── SDK & Examples ── */}
          {activeSection === "sdk" && (
            <section className="space-y-5">
              <SectionHeader title="SDK & Code Examples" desc="Contoh implementasi lengkap dalam berbagai bahasa pemrograman. Semua contoh siap pakai." />

              {/* JavaScript / TypeScript */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🟨</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JavaScript / TypeScript — SDK Helper</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="typescript" id="sdk-ts" code={`// snaptok.ts — Bisa dipakai di browser maupun Node.js
const BASE_URL = "${BASE}";

interface SnapTokOptions {
  apikey: string;
}

interface DownloadData {
  id: string;
  title: string;
  cover: string;
  duration: number;
  author: { nickname: string; unique_id: string; avatar: string };
  stats: { play: number; likes: number; comment: number; share: number };
  music: { title: string; author: string };
  download: {
    video_hd: string | null;
    video_sd: string | null;
    video_watermark: string | null;
    audio: string | null;
    images: string[] | null;
  };
}

class SnapTok {
  private apikey: string;

  constructor(options: SnapTokOptions) {
    this.apikey = options.apikey;
  }

  async download(platform: "tiktok" | "douyin", url: string): Promise<DownloadData> {
    const res = await fetch(
      \`\${BASE_URL}/api/v3/download?platform=\${platform}&url=\${encodeURIComponent(url)}&apikey=\${this.apikey}\`
    );
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json.data;
  }

  async search(query: string, count = 20, cursor = 0) {
    const res = await fetch(
      \`\${BASE_URL}/api/v3/tiktok/search?q=\${encodeURIComponent(query)}&count=\${count}&cursor=\${cursor}&apikey=\${this.apikey}\`
    );
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    return json;
  }
}

export const snaptok = new SnapTok({ apikey: "${userKey}" });

// Usage
const data = await snaptok.download("tiktok", "https://vt.tiktok.com/xxx");
console.log(data.download.video_hd);

const results = await snaptok.search("kucing lucu");
console.log(results.videos.length);`} />
                </div>
              </div>

              {/* Python */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🐍</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Python — requests</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="python" id="sdk-python" code={`import requests
from urllib.parse import quote

BASE_URL = "${BASE}"
API_KEY = "${userKey}"

def download_video(url: str, platform: str = "tiktok") -> dict:
    """Download video TikTok atau Douyin tanpa watermark."""
    resp = requests.get(
        f"{BASE_URL}/api/v3/download",
        params={
            "platform": platform,
            "url": url,
            "apikey": API_KEY,
        }
    )
    resp.raise_for_status()
    data = resp.json()
    if not data["success"]:
        raise ValueError(data.get("error", "Unknown error"))
    return data["data"]


def search_tiktok(query: str, count: int = 20, cursor: int = 0) -> dict:
    """Cari video TikTok berdasarkan keyword."""
    resp = requests.get(
        f"{BASE_URL}/api/v3/tiktok/search",
        params={"q": query, "count": count, "cursor": cursor, "apikey": API_KEY}
    )
    resp.raise_for_status()
    return resp.json()


def save_video(proxy_url: str, filename: str) -> None:
    """Download file dari proxy URL dan simpan ke disk."""
    with requests.get(proxy_url, stream=True) as r:
        r.raise_for_status()
        with open(filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    print(f"Saved: {filename}")


if __name__ == "__main__":
    # Download TikTok
    video = download_video("https://vt.tiktok.com/xxx")
    print(f"Title: {video['title']}")
    print(f"Likes: {video['stats']['likes']:,}")

    # Simpan ke file
    if video["download"]["video_hd"]:
        save_video(video["download"]["video_hd"], "video.mp4")

    # Search
    results = search_tiktok("kucing lucu", count=10)
    for v in results["videos"]:
        print(f"- {v['title']} | {v['stats']['play']:,} views")`} />
                </div>
              </div>

              {/* PHP */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🐘</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PHP — cURL / file_get_contents</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="php" id="sdk-php" code={`<?php

define('SNAPTOK_BASE', '${BASE}');
define('SNAPTOK_KEY',  '${userKey}');

function snaptok_download(string $url, string $platform = 'tiktok'): array {
    $endpoint = SNAPTOK_BASE . '/api/v3/download?' . http_build_query([
        'platform' => $platform,
        'url'      => $url,
        'apikey'   => SNAPTOK_KEY,
    ]);

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 30,
    ]);
    $body   = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($status !== 200) throw new RuntimeException("HTTP $status");
    $json = json_decode($body, true);
    if (!$json['success']) throw new RuntimeException($json['error'] ?? 'Unknown error');
    return $json['data'];
}

function snaptok_search(string $query, int $count = 20, int $cursor = 0): array {
    $endpoint = SNAPTOK_BASE . '/api/v3/tiktok/search?' . http_build_query([
        'q'      => $query,
        'count'  => $count,
        'cursor' => $cursor,
        'apikey' => SNAPTOK_KEY,
    ]);
    return json_decode(file_get_contents($endpoint), true);
}

// Usage
$video = snaptok_download('https://vt.tiktok.com/xxx');
echo $video['title'] . PHP_EOL;
echo 'Likes: ' . number_format($video['stats']['likes']) . PHP_EOL;

if ($video['download']['video_hd']) {
    echo 'HD: ' . $video['download']['video_hd'] . PHP_EOL;
}

// Download file langsung
$fp = fopen('video.mp4', 'wb');
$ch = curl_init($video['download']['video_hd']);
curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_exec($ch);
curl_close($ch);
fclose($fp);`} />
                </div>
              </div>

              {/* cURL */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🖥️</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">cURL — Command Line</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">Download info video:</p>
                  <CodeBlock lang="bash" id="sdk-curl-dl" code={`curl -s "${BASE}/api/v3/download?platform=tiktok&url=https://vt.tiktok.com/xxx&apikey=${userKey}" | jq .`} />
                  <p className="text-xs text-muted-foreground">Search video:</p>
                  <CodeBlock lang="bash" id="sdk-curl-search" code={`curl -s "${BASE}/api/v3/tiktok/search?q=kucing+lucu&count=5&apikey=${userKey}" | jq '.videos[].title'`} />
                  <p className="text-xs text-muted-foreground">Download file langsung ke disk:</p>
                  <CodeBlock lang="bash" id="sdk-curl-save" code={`# 1. Ambil proxy URL dari API
PROXY_URL=$(curl -s "${BASE}/api/v3/download?platform=tiktok&url=https://vt.tiktok.com/xxx&apikey=${userKey}" \\
  | jq -r '.data.download.video_hd')

# 2. Download file
curl -L -o video.mp4 "$PROXY_URL"
echo "Done! $(du -sh video.mp4)"
`} />
                </div>
              </div>

              {/* Go */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <span className="text-sm">🔵</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Go — net/http</span>
                </div>
                <div className="p-4">
                  <CodeBlock lang="go" id="sdk-go" code={`package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

const (
	baseURL = "${BASE}"
	apiKey  = "${userKey}"
)

type DownloadResponse struct {
	Success bool \`json:"success"\`
	Data    struct {
		ID    string \`json:"id"\`
		Title string \`json:"title"\`
		Download struct {
			VideoHD string \`json:"video_hd"\`
			Audio   string \`json:"audio"\`
		} \`json:"download"\`
	} \`json:"data"\`
	Error string \`json:"error"\`
}

func downloadVideo(videoURL string) (*DownloadResponse, error) {
	endpoint := fmt.Sprintf(
		"%s/api/v3/download?platform=tiktok&url=%s&apikey=%s",
		baseURL, url.QueryEscape(videoURL), apiKey,
	)
	resp, err := http.Get(endpoint)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result DownloadResponse
	json.NewDecoder(resp.Body).Decode(&result)
	if !result.Success {
		return nil, fmt.Errorf("API error: %s", result.Error)
	}
	return &result, nil
}

func saveFile(proxyURL, filename string) error {
	resp, err := http.Get(proxyURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	f, _ := os.Create(filename)
	defer f.Close()
	io.Copy(f, resp.Body)
	return nil
}

func main() {
	data, err := downloadVideo("https://vt.tiktok.com/xxx")
	if err != nil {
		panic(err)
	}
	fmt.Println("Title:", data.Data.Title)
	saveFile(data.Data.Download.VideoHD, "video.mp4")
}`} />
                </div>
              </div>
            </section>
          )}

          {/* ── Error Codes ── */}
          {activeSection === "errors" && (
            <section className="space-y-5">
              <SectionHeader title="Error Codes" desc="Semua error response menggunakan format JSON standar. Periksa field error untuk pesan detail." />

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Format Error Response</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="json" id="err-format" code={`{
  "success": false,
  "error": "Pesan error yang menjelaskan masalah",
  "code": "INVALID_API_KEY",
  "docs": "https://www.snaptok.my.id/docs"
}`} />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-2">
                  <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HTTP Status Codes</span>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { code: "200", color: "bg-green-500/10 text-green-600 dark:text-green-400",  desc: "Request berhasil. Periksa field success: true." },
                    { code: "400", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", desc: "Bad Request — Parameter wajib tidak ada, URL tidak valid, atau format salah." },
                    { code: "401", color: "bg-red-500/10 text-red-500",     desc: "Unauthorized — API key tidak ada, tidak valid, atau tidak dimulai dengan snp-." },
                    { code: "403", color: "bg-orange-500/10 text-orange-500", desc: "Forbidden — Domain tidak diizinkan (proxy endpoint) atau plan tidak mendukung fitur." },
                    { code: "404", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", desc: "Not Found — Video tidak ditemukan, sudah dihapus, atau akun privat." },
                    { code: "429", color: "bg-orange-500/10 text-orange-500", desc: "Too Many Requests — Melewati rate limit. Lihat header X-RateLimit-Reset." },
                    { code: "500", color: "bg-red-500/10 text-red-500",     desc: "Internal Server Error — Server error, coba lagi dalam beberapa detik." },
                    { code: "502", color: "bg-red-500/10 text-red-500",     desc: "Bad Gateway — Upstream CDN error saat proxy download. Biasanya sementara." },
                    { code: "503", color: "bg-red-500/10 text-red-500",     desc: "Service Unavailable — Server sedang maintenance. Cek status page." },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${row.color} flex-shrink-0`}>{row.code}</span>
                      <span className="text-sm text-muted-foreground">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Error Code Reference</p>
                </div>
                <div className="p-4">
                  <ParamTable
                    cols={["code", "HTTP", "Penyebab & Solusi"]}
                    rows={[
                      ["INVALID_API_KEY",    "401", "Key tidak valid atau tidak ada. Cek format snp-xxx di dashboard."],
                      ["MISSING_PARAM",      "400", "Parameter wajib (url, platform, q) tidak dikirim."],
                      ["INVALID_PLATFORM",   "400", "Nilai platform bukan tiktok atau douyin."],
                      ["INVALID_URL",        "400", "URL bukan URL TikTok/Douyin yang valid."],
                      ["VIDEO_NOT_FOUND",    "404", "Video tidak ada, sudah dihapus, atau akun privat."],
                      ["DOMAIN_FORBIDDEN",   "403", "Domain request tidak terdaftar di whitelist proxy."],
                      ["RATE_LIMIT",         "429", "Melewati limit per menit. Tunggu window berikutnya."],
                      ["QUOTA_EXCEEDED",     "429", "Kuota bulanan habis. Upgrade plan atau tunggu reset."],
                      ["UPSTREAM_ERROR",     "502", "CDN TikTok/Douyin error. Coba ulang dalam 5-10 detik."],
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contoh Error Handling (JavaScript)</p>
                </div>
                <div className="p-4">
                  <CodeBlock lang="javascript" id="err-js" code={`async function safeDownload(url) {
  try {
    const res = await fetch(
      \`${BASE}/api/v3/download?platform=tiktok&url=\${encodeURIComponent(url)}&apikey=${userKey}\`
    );
    const json = await res.json();

    if (!json.success) {
      switch (json.code) {
        case "VIDEO_NOT_FOUND":
          throw new Error("Video tidak ditemukan atau sudah dihapus.");
        case "INVALID_API_KEY":
          throw new Error("API key tidak valid. Cek dashboard kamu.");
        case "RATE_LIMIT":
          throw new Error("Terlalu banyak request. Tunggu sebentar.");
        case "QUOTA_EXCEEDED":
          throw new Error("Kuota bulan ini habis. Upgrade plan.");
        default:
          throw new Error(json.error || "Terjadi kesalahan.");
      }
    }

    return json.data;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Gagal terhubung ke server. Cek koneksi internet.");
    }
    throw err;
  }
}`} />
                </div>
              </div>
            </section>
          )}

          {/* ── Changelog ── */}
          {activeSection === "changelog" && (
            <section className="space-y-5">
              <SectionHeader title="Changelog" desc="Riwayat perubahan dan pembaruan API SnaptokAPI." />

              <div className="space-y-4">
                {[
                  {
                    version: "v3.4.0",
                    date: "2026-02-15",
                    badge: "latest",
                    badgeColor: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
                    changes: [
                      { type: "new",  text: "Proxy endpoint kini mendukung streaming langsung dengan chunk transfer encoding untuk file besar." },
                      { type: "new",  text: "Tambahan field duration_ms di response download untuk durasi video yang lebih presisi." },
                      { type: "imp",  text: "Performa download meningkat ~45% berkat optimasi edge caching di seluruh region." },
                      { type: "fix",  text: "Perbaikan bug timeout pada video Douyin berdurasi lebih dari 10 menit." },
                      { type: "fix",  text: "Response error kini selalu menyertakan field error_code yang konsisten." },
                    ],
                  },
                  {
                    version: "v3.3.0",
                    date: "2026-01-10",
                    badge: null,
                    badgeColor: "",
                    changes: [
                      { type: "new",  text: "Support audio extraction Douyin — platform=douyin kini mendukung format MP3." },
                      { type: "new",  text: "Header X-Request-ID ditambahkan ke semua response untuk kemudahan debugging." },
                      { type: "imp",  text: "Rate limit free tier diperbarui: 500 request/hari (sebelumnya 300)." },
                      { type: "fix",  text: "Perbaikan parsing link share Douyin format baru (v.douyin.com/xxx)." },
                      { type: "fix",  text: "Bug redirect loop saat CDN Douyin mengembalikan 302 berulang kali telah diperbaiki." },
                    ],
                  },
                  {
                    version: "v3.2.0",
                    date: "2025-10-01",
                    badge: null,
                    badgeColor: "",
                    changes: [
                      { type: "new",  text: "Search API — Endpoint /api/v3/tiktok/search dengan pagination cursor-based." },
                      { type: "new",  text: "Support slideshow/foto konten TikTok & Douyin. Field images berisi array URL." },
                      { type: "new",  text: "Error code field ditambahkan ke semua error response." },
                      { type: "fix",  text: "Perbaikan parsing URL pendek vt.tiktok.com yang kadang gagal." },
                      { type: "fix",  text: "Response time proxy dipercepat ~30% dengan edge caching." },
                    ],
                  },
                  {
                    version: "v3.0.0 — v3.1.x",
                    date: "2025-01-01 — 2025-09-30",
                    badge: null,
                    badgeColor: "",
                    changes: [
                      { type: "new",   text: "Autentikasi API key wajib. Format snp-xxx." },
                      { type: "new",   text: "Proxy endpoint /api/v3/proxy untuk streaming file." },
                      { type: "new",   text: "Support Douyin — endpoint yang sama, tambah platform=douyin." },
                      { type: "imp",   text: "Response structure lebih konsisten dengan field author dan stats lengkap." },
                      { type: "break", text: "Endpoint v2 deprecated. Semua request harus ke /api/v3/." },
                    ],
                  },
                ].map((release) => (
                  <div key={release.version} className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center gap-3">
                      <code className="text-sm font-mono font-bold">{release.version}</code>
                      {release.badge && (
                        <Badge className={`text-xs border ${release.badgeColor}`}>{release.badge}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{release.date}</span>
                    </div>
                    <div className="divide-y divide-border">
                      {release.changes.map((c, i) => {
                        const typeStyle: Record<string, { color: string; label: string }> = {
                          new:   { color: "bg-green-500/10 text-green-600 dark:text-green-400",   label: "NEW" },
                          fix:   { color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",      label: "FIX" },
                          imp:   { color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", label: "IMP" },
                          break: { color: "bg-red-500/10 text-red-600 dark:text-red-400",          label: "BREAK" },
                          dep:   { color: "bg-zinc-500/10 text-zinc-500",                          label: "DEP" },
                        };
                        const ts = typeStyle[c.type] ?? typeStyle.imp;
                        return (
                          <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 ${ts.color}`}>{ts.label}</span>
                            <p className="text-sm text-muted-foreground">{c.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <InfoBox type="info" title="Subscribe ke update">
                Aktifkan notifikasi email di Settings untuk mendapatkan info changelog terbaru langsung ke inbox kamu.
              </InfoBox>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
