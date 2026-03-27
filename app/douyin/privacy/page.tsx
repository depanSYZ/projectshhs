"use client";
import React from "react";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { Shield, Eye, Lock, Cookie, FileText, Mail, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode } from "@/lib/i18n";

type Section = { icon: React.ElementType; title: Record<LangCode, string>; content: Record<LangCode, string>; color: string };

const sections: Section[] = [
  {
    icon: Eye,
    color: "blue",
    title: { en: "Information We Collect", id: "Informasi yang Kami Kumpulkan", ru: "Информация, которую мы собираем", zh: "我们收集的信息", ar: "المعلومات التي نجمعها" },
    content: {
      en: "We collect minimal information:\n\n• The Douyin/TikTok URL you submit\n• Anonymous analytics (visitor counts, pages visited)\n• Technical info like browser type and device\n\nWe do NOT collect:\n• Personal info (name, email, phone)\n• Your Douyin or TikTok login credentials\n• Your browsing history outside our site\n• Payment information of any kind",
      id: "Kami mengumpulkan informasi minimal:\n\n• URL Douyin/TikTok yang Anda masukkan\n• Data analitik anonim (jumlah pengunjung, halaman)\n• Informasi teknis seperti jenis browser dan perangkat\n\nKami TIDAK mengumpulkan:\n• Informasi pribadi (nama, email, telepon)\n• Kredensial login Douyin atau TikTok Anda\n• Riwayat browsing di luar situs kami\n• Informasi pembayaran apapun",
      ru: "Мы собираем минимум информации:\n\n• URL Douyin/TikTok, который вы вводите\n• Анонимная аналитика\n• Технические данные (браузер, устройство)\n\nМЫ НЕ собираем:\n• Личные данные\n• Учётные данные Douyin/TikTok\n• Историю просмотров\n• Платёжные данные",
      zh: "我们收集最少量的信息：\n\n• 您提交的 Douyin/TikTok 链接\n• 匿名分析数据\n• 技术信息（浏览器类型和设备）\n\n我们不收集：\n• 个人信息\n• 您的登录凭据\n• 浏览记录\n• 支付信息",
      ar: "نجمع معلومات بالحد الأدنى:\n\n• رابط Douyin/TikTok\n• بيانات تحليلية مجهولة\n• معلومات تقنية\n\nلا نجمع:\n• معلومات شخصية\n• بيانات تسجيل الدخول\n• سجل التصفح\n• معلومات مالية",
    },
  },
  {
    icon: Lock,
    color: "emerald",
    title: { en: "Data Security", id: "Keamanan Data", ru: "Безопасность данных", zh: "数据安全", ar: "أمان البيانات" },
    content: {
      en: "Your security is our priority:\n\n• All connections encrypted with SSL/TLS (HTTPS)\n• We never store downloaded videos on our servers\n• URLs are processed temporarily and never permanently stored\n• Secure cloud infrastructure with regular security audits\n• Zero-knowledge architecture — we cannot see your content",
      id: "Keamanan Anda adalah prioritas kami:\n\n• Semua koneksi dienkripsi SSL/TLS (HTTPS)\n• Kami tidak pernah menyimpan video di server kami\n• URL diproses sementara, tidak pernah disimpan permanen\n• Infrastruktur cloud aman dengan audit keamanan berkala\n• Arsitektur zero-knowledge",
      ru: "Безопасность — наш приоритет:\n\n• Все соединения зашифрованы SSL/TLS\n• Видео не хранятся на серверах\n• URL обрабатываются временно\n• Регулярные аудиты безопасности\n• Zero-knowledge архитектура",
      zh: "您的安全是我们的首要任务：\n\n• 所有连接均使用 SSL/TLS 加密\n• 我们从不存储下载的视频\n• URL 仅被临时处理\n• 定期进行安全审计\n• 零知识架构",
      ar: "أمانك هو أولويتنا:\n\n• جميع الاتصالات مشفرة SSL/TLS\n• لا نخزن مقاطع الفيديو\n• الروابط تُعالج مؤقتاً\n• تدقيقات أمنية دورية\n• هندسة معرفة صفرية",
    },
  },
  {
    icon: Cookie,
    color: "amber",
    title: { en: "Cookie Usage", id: "Penggunaan Cookies", ru: "Использование cookies", zh: "Cookie 使用", ar: "استخدام ملفات الكوكيز" },
    content: {
      en: "We use cookies to:\n\n• Improve user experience and performance\n• Remember your preferences (language, theme)\n• Website analytics (anonymized)\n• Session management for authenticated users\n\nYou can manage cookie preferences in your browser settings at any time. We do not use tracking or advertising cookies.",
      id: "Kami menggunakan cookies untuk:\n\n• Meningkatkan pengalaman dan performa\n• Mengingat preferensi Anda (bahasa, tema)\n• Analitik website (dianonimkan)\n• Manajemen sesi untuk pengguna terautentikasi\n\nAnda dapat mengelola cookies di pengaturan browser kapan saja. Kami tidak menggunakan cookies pelacak atau iklan.",
      ru: "Мы используем cookies для:\n\n• Улучшения опыта пользователей\n• Сохранения настроек (язык, тема)\n• Анонимной аналитики\n• Управления сессиями\n\nНе используем рекламные cookies.",
      zh: "我们使用 Cookie 来：\n\n• 提升用户体验\n• 记住您的偏好（语言、主题）\n• 匿名网站分析\n• 会话管理\n\n我们不使用跟踪或广告 Cookie。",
      ar: "نستخدم ملفات الكوكيز من أجل:\n\n• تحسين تجربة المستخدم\n• تذكر تفضيلاتك\n• تحليلات مجهولة الهوية\n• إدارة الجلسات\n\nلا نستخدم كوكيز التتبع أو الإعلانات.",
    },
  },
  {
    icon: FileText,
    color: "purple",
    title: { en: "Copyright & Usage", id: "Hak Cipta & Penggunaan", ru: "Авторские права и использование", zh: "版权与使用", ar: "حقوق النشر والاستخدام" },
    content: {
      en: "Important copyright notice:\n\n• SnapYin does not own any downloaded videos\n• Users are fully responsible for how they use downloaded content\n• We strongly recommend always respecting creator copyrights\n• Use downloaded content for personal use only\n• Do not redistribute or monetize without creator's permission\n• Content must not be used for commercial purposes without authorization",
      id: "Ketentuan hak cipta penting:\n\n• SnapYin tidak memiliki video yang diunduh\n• Pengguna bertanggung jawab penuh atas penggunaan konten\n• Kami sangat menyarankan menghormati hak cipta kreator\n• Gunakan hanya untuk keperluan pribadi\n• Jangan distribusikan atau monetisasi tanpa izin kreator\n• Konten tidak boleh digunakan untuk tujuan komersial",
      ru: "Важно об авторских правах:\n\n• SnapYin не владеет скачанными видео\n• Пользователи несут полную ответственность\n• Уважайте авторские права\n• Только для личного использования\n• Не перераспространяйте без разрешения",
      zh: "版权重要说明：\n\n• SnapYin 不拥有下载的视频\n• 用户对下载内容负全责\n• 始终尊重创作者版权\n• 仅供个人使用\n• 未经许可不得转发或变现",
      ar: "إشعار حقوق النشر:\n\n• SnapYin لا تمتلك مقاطع الفيديو المنزّلة\n• يتحمل المستخدمون المسؤولية الكاملة\n• احترم حقوق المبدعين دائماً\n• للاستخدام الشخصي فقط\n• لا تعيد التوزيع بدون إذن",
    },
  },
];

const colorMap: Record<string, { border: string; bg: string; icon: string; dot: string }> = {
  blue:    { border: "border-blue-500/25",   bg: "bg-blue-500/8",   icon: "bg-blue-500/15 border-blue-500/30 text-blue-400",   dot: "bg-blue-400" },
  emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/8", icon: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400", dot: "bg-emerald-400" },
  amber:   { border: "border-amber-500/25",  bg: "bg-amber-500/8",  icon: "bg-amber-500/15 border-amber-500/30 text-amber-400",  dot: "bg-amber-400" },
  purple:  { border: "border-purple-500/25", bg: "bg-purple-500/8", icon: "bg-purple-500/15 border-purple-500/30 text-purple-400", dot: "bg-purple-400" },
};

export default function PrivacyPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <DouyinHeader />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-primary/4 blur-2xl pointer-events-none" />
          <div className="container mx-auto max-w-4xl text-center relative">
            <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 p-5 mb-6 shadow-lg">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {t(tr.privacy_page.title, lang)}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              {t(tr.privacy_page.subtitle, lang)}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {t(tr.privacy_page.updated, lang)}: Februari 2026
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 pb-16 space-y-5">
          {sections.map((section, i) => {
            const Icon = section.icon;
            const c = colorMap[section.color];
            return (
              <div key={i} className={`rounded-2xl border ${c.border} ${c.bg} p-6 md:p-8`}>
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl border p-3 flex-shrink-0 ${c.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold mb-3">
                      {(section.title as Record<string, string>)[lang] ?? section.title.en}
                    </h2>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed text-sm">
                      {(section.content as Record<string, string>)[lang] ?? section.content.en}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Contact */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 p-4 mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t(tr.privacy_page.contact, lang)}</h2>
            <p className="text-muted-foreground text-sm mb-4">{t(tr.privacy_page.contact_sub, lang)}</p>
            <a href="mailto:defandryannn@gmail.com" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              defandryannn@gmail.com <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Changes notice */}
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <h3 className="font-semibold text-sm mb-2">{t(tr.privacy_page.changes, lang)}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{t(tr.privacy_page.changes_body, lang)}</p>
          </div>
        </div>
      </main>
      <DouyinFooter />
    </div>
  );
}
