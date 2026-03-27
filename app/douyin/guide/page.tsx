"use client";
import React from "react";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { BookOpen, Copy, Link as LinkIcon, Download, CheckCircle, Smartphone, Monitor, ArrowRight, Lightbulb, Wifi, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode } from "@/lib/i18n";

type StepData = { title: Record<LangCode, string>; desc: Record<LangCode, string> };

const steps: StepData[] = [
  {
    title: { en: "Open Douyin / TikTok App", id: "Buka Aplikasi Douyin / TikTok", ru: "Откройте Douyin / TikTok", zh: "打开 Douyin / TikTok 应用", ar: "افتح تطبيق Douyin / TikTok" },
    desc:  { en: "Open Douyin or TikTok on your phone or browser. Find the video you want to download and open it.", id: "Buka aplikasi Douyin atau TikTok di HP atau browser. Temukan video yang ingin diunduh dan buka.", ru: "Откройте Douyin или TikTok на телефоне или браузере. Найдите нужное видео.", zh: "在手机或浏览器上打开 Douyin 或 TikTok，找到您想下载的视频并打开。", ar: "افتح Douyin أو TikTok على هاتفك أو المتصفح. ابحث عن الفيديو وافتحه." },
  },
  {
    title: { en: "Copy Video Link", id: "Salin Link Video", ru: "Скопируйте ссылку", zh: "复制视频链接", ar: "انسخ رابط الفيديو" },
    desc:  { en: 'Tap "Share" on the video, then choose "Copy Link". The link is now in your clipboard.', id: 'Klik tombol "Share" lalu pilih "Salin Link". Link sudah tersalin ke clipboard Anda.', ru: 'Нажмите «Поделиться», затем «Скопировать ссылку». Ссылка скопирована.', zh: '点击"分享"按钮，然后选择"复制链接"。链接已复制到剪贴板。', ar: 'اضغط "مشاركة" ثم اختر "نسخ الرابط". تم نسخ الرابط.' },
  },
  {
    title: { en: "Paste the Link Here", id: "Tempelkan Link di Sini", ru: "Вставьте ссылку", zh: "在此粘贴链接", ar: "الصق الرابط هنا" },
    desc:  { en: "Come back to SnapYin and paste the link in the input field on the homepage.", id: "Kembali ke SnapYin dan tempelkan link di kolom input di halaman utama.", ru: "Вернитесь на SnapYin и вставьте ссылку в поле ввода на главной странице.", zh: "回到 SnapYin，将链接粘贴到主页的输入框中。", ar: "عد إلى SnapYin والصق الرابط في حقل الإدخال في الصفحة الرئيسية." },
  },
  {
    title: { en: "Choose Format & Download", id: "Pilih Format & Unduh", ru: "Выберите формат и скачайте", zh: "选择格式并下载", ar: "اختر الصيغة وحمّل" },
    desc:  { en: 'Click "Download Now" and choose your preferred format: HD Video, MP3 Audio, or Image slideshow.', id: 'Klik "Unduh Sekarang" dan pilih format: Video HD, Audio MP3, atau Slideshow Gambar.', ru: 'Нажмите «Скачать» и выберите формат: HD видео, MP3 или изображения.', zh: '点击"立即下载"，选择格式：HD 视频、MP3 音频或图片幻灯片。', ar: 'اضغط "تنزيل الآن" واختر الصيغة: فيديو HD أو MP3 أو صور.' },
  },
  {
    title: { en: "Done! Enjoy!", id: "Selesai! Nikmati!", ru: "Готово! Наслаждайтесь!", zh: "完成！尽情享用！", ar: "انتهى! استمتع!" },
    desc:  { en: "Your watermark-free video is ready. Saved directly to your device with no registration needed.", id: "Video tanpa watermark sudah siap. Tersimpan langsung ke perangkat Anda tanpa perlu registrasi.", ru: "Видео без водяного знака готово. Сохранено на устройство без регистрации.", zh: "无水印视频已准备好，直接保存到您的设备，无需注册。", ar: "الفيديو بدون علامة مائية جاهز. محفوظ على جهازك بدون تسجيل." },
  },
];

const tips: { icon: React.ElementType; title: Record<LangCode, string>; desc: Record<LangCode, string> }[] = [
  {
    icon: Globe,
    title: { en: "Use Valid Links", id: "Pastikan Link Valid", ru: "Используйте правильные ссылки", zh: "使用有效链接", ar: "استخدم روابط صالحة" },
    desc:  { en: "Use links directly from Douyin or TikTok. Links from other platforms may not work.", id: "Gunakan link langsung dari Douyin atau TikTok. Link dari platform lain mungkin tidak berfungsi.", ru: "Используйте ссылки только из Douyin или TikTok.", zh: "使用直接来自 Douyin 或 TikTok 的链接。", ar: "استخدم الروابط مباشرةً من Douyin أو TikTok." },
  },
  {
    icon: Wifi,
    title: { en: "Stable Connection", id: "Koneksi Stabil", ru: "Стабильное соединение", zh: "稳定的网络连接", ar: "اتصال مستقر" },
    desc:  { en: "A stable internet connection ensures smooth and fast downloads.", id: "Koneksi internet stabil memastikan proses download yang lancar dan cepat.", ru: "Стабильное соединение обеспечивает плавную загрузку.", zh: "稳定的网络连接确保流畅快速的下载。", ar: "الاتصال المستقر يضمن تنزيلاً سلساً وسريعاً." },
  },
  {
    icon: Lightbulb,
    title: { en: "Public Videos Only", id: "Video Publik Saja", ru: "Только публичные видео", zh: "仅限公开视频", ar: "الفيديوهات العامة فقط" },
    desc:  { en: "Only public videos can be downloaded. Private or restricted videos are not accessible.", id: "Hanya video publik yang dapat diunduh. Video privat atau terbatas tidak dapat diakses.", ru: "Только публичные видео доступны для скачивания.", zh: "只有公开视频可以下载，私密视频无法访问。", ar: "يمكن تنزيل الفيديوهات العامة فقط." },
  },
  {
    icon: ShieldCheck,
    title: { en: "Respect Copyright", id: "Hormati Hak Cipta", ru: "Уважайте авторские права", zh: "尊重版权", ar: "احترم حقوق النشر" },
    desc:  { en: "Use downloaded content for personal use only. Always credit the original creator.", id: "Gunakan konten untuk keperluan pribadi. Selalu berikan kredit kepada kreator asli.", ru: "Только для личного использования. Указывайте автора.", zh: "仅将下载内容用于个人用途，始终向原创作者致谢。", ar: "استخدم المحتوى للأغراض الشخصية فقط." },
  },
];

const icons = [Smartphone, Copy, LinkIcon, Download, CheckCircle];
const stepColors = ["bg-blue-500", "bg-violet-500", "bg-pink-500", "bg-orange-500", "bg-green-500"];

export default function GuidePage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <DouyinHeader />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
          <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="container mx-auto max-w-4xl text-center relative">
            <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 p-5 mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t(tr.guide_page.title, lang)}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">{t(tr.guide_page.subtitle_douyin, lang)}</p>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 pb-16">
          {/* Steps — timeline style */}
          <div className="relative mb-16">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden md:block" />
            <div className="space-y-4">
              {steps.map((step, i) => {
                const Icon = icons[i];
                return (
                  <div key={i} className="relative flex gap-6 group">
                    {/* Step number circle */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-2xl ${stepColors[i]} text-white flex items-center justify-center font-bold text-lg shadow-lg z-10`}>
                        {i + 1}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-colors p-5 mb-1 group-hover:border-primary/30">
                      <div className="flex items-start gap-3">
                        <div className="hidden sm:flex items-center justify-center rounded-xl bg-muted p-2.5 flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base mb-1">{(step.title as Record<string, string>)[lang] ?? step.title.en}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{(step.desc as Record<string, string>)[lang] ?? step.desc.en}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Devices */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">{t(tr.guide_page.devices, lang)}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Smartphone, title: { en: "Smartphone & Tablet", id: "Smartphone & Tablet", ru: "Смартфон и планшет", zh: "智能手机和平板", ar: "الهاتف والجهاز اللوحي" }, desc: { en: "Android, iPhone, iPad — all browsers supported", id: "Android, iPhone, iPad — semua browser didukung", ru: "Android, iPhone, iPad — все браузеры", zh: "Android、iPhone、iPad，所有浏览器均支持", ar: "Android وiPhone وiPad — جميع المتصفحات مدعومة" } },
                { icon: Monitor, title: { en: "Desktop & Laptop", id: "Desktop & Laptop", ru: "ПК и ноутбук", zh: "桌面和笔记本", ar: "الكمبيوتر والحاسوب المحمول" }, desc: { en: "Windows, Mac, Linux — Chrome, Firefox, Safari, Edge", id: "Windows, Mac, Linux — Chrome, Firefox, Safari, Edge", ru: "Windows, Mac, Linux — Chrome, Firefox, Safari, Edge", zh: "Windows、Mac、Linux — 所有主流浏览器", ar: "Windows وMac وLinux — جميع المتصفحات الرئيسية" } },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="rounded-2xl border border-border bg-card hover:bg-muted/30 transition-colors p-6 flex items-center gap-4">
                    <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 flex-shrink-0">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{(item.title as Record<string, string>)[lang] ?? item.title.en}</h3>
                      <p className="text-sm text-muted-foreground">{(item.desc as Record<string, string>)[lang] ?? item.desc.en}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">{t(tr.guide_page.tips, lang)}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {tips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div key={i} className="rounded-2xl border border-border bg-card hover:bg-muted/30 transition-colors p-5 flex gap-4">
                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5 h-fit flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{(tip.title as Record<string, string>)[lang] ?? tip.title.en}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{(tip.desc as Record<string, string>)[lang] ?? tip.desc.en}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4 relative">{t(tr.guide_page.ready, lang)}</h2>
            <Link href="/douyin" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors relative">
              {t(tr.guide_page.start, lang)} <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>
      <DouyinFooter />
    </div>
  );
}
