"use client";
import { DouyinHeader } from "@/components/douyin-header";
import { DouyinFooter } from "@/components/douyin-footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { translations as tr, t, LangCode } from "@/lib/i18n";

const faqData: { q: Record<LangCode, string>; a: Record<LangCode, string> }[] = [
  {
    q: { en: "What is SnapYin?", id: "Apa itu SnapYin?", ru: "Что такое SnapYin?", zh: "什么是 SnapYin？", ar: "ما هو SnapYin؟" },
    a: { en: "SnapYin is a free online service to download Douyin (抖音) videos without watermark. Paste any Douyin link and get your video in seconds — fast, safe, and completely free.", id: "SnapYin adalah layanan online gratis untuk mengunduh video Douyin (抖音) tanpa watermark. Tempel link Douyin apapun dan dapatkan video dalam hitungan detik — cepat, aman, dan gratis.", ru: "SnapYin — бесплатный сервис для скачивания видео Douyin (抖音) без водяного знака. Быстро, безопасно и совершенно бесплатно.", zh: "SnapYin 是一项免费在线服务，可下载无水印的抖音（Douyin）视频。粘贴任何抖音链接，几秒钟内即可获得视频——快速、安全、完全免费。", ar: "SnapYin هي خدمة مجانية لتنزيل مقاطع Douyin (抖音) بدون علامة مائية. الصق أي رابط Douyin واحصل على الفيديو في ثوانٍ." },
  },
  {
    q: { en: "What is the difference between Douyin and TikTok?", id: "Apa perbedaan Douyin dan TikTok?", ru: "В чём разница между Douyin и TikTok?", zh: "抖音和 TikTok 有什么区别？", ar: "ما الفرق بين Douyin وTikTok؟" },
    a: { en: "Douyin (抖音) is the Chinese version of TikTok, operated by ByteDance exclusively for users in mainland China. It has exclusive content, creators, and features not available on the international TikTok platform. SnapYin supports both Douyin and TikTok links.", id: "Douyin (抖音) adalah versi China dari TikTok yang dioperasikan oleh ByteDance khusus untuk pengguna di daratan China. Memiliki konten, kreator, dan fitur eksklusif yang tidak ada di TikTok internasional. SnapYin mendukung link Douyin dan TikTok.", ru: "Douyin (抖音) — китайская версия TikTok, только для материкового Китая. Имеет эксклюзивный контент и создателей. SnapYin поддерживает оба.", zh: "抖音是专为中国大陆用户运营的 TikTok 中国版，拥有独家内容、创作者和功能。SnapYin 同时支持抖音和 TikTok 链接。", ar: "Douyin (抖音) هو نسخة TikTok الصينية، يعمل حصرياً لمستخدمي الصين ويتضمن محتوى حصرياً. SnapYin يدعم روابط كليهما." },
  },
  {
    q: { en: "Is it free to use?", id: "Apakah gratis digunakan?", ru: "Это бесплатно?", zh: "免费使用吗？", ar: "هل هو مجاني؟" },
    a: { en: "Yes, 100% free with no hidden fees, no download limits, and no registration required for basic use. Just paste and download.", id: "Ya, 100% gratis tanpa biaya tersembunyi, tanpa batasan download, dan tanpa perlu registrasi untuk penggunaan dasar. Cukup tempel dan unduh.", ru: "Да, 100% бесплатно, без скрытых платежей, без лимитов, без регистрации для базового использования.", zh: "是的，100% 免费，无隐藏费用，无下载限制，基本使用无需注册。直接粘贴并下载即可。", ar: "نعم، مجاني 100% بدون رسوم خفية أو قيود تنزيل. فقط الصق الرابط وحمّل." },
  },
  {
    q: { en: "How do I download a Douyin video?", id: "Bagaimana cara mengunduh video Douyin?", ru: "Как скачать видео Douyin?", zh: "如何下载抖音视频？", ar: "كيف أحمّل فيديو Douyin؟" },
    a: { en: "1) Open Douyin and find the video\n2) Tap Share → Copy Link\n3) Paste the link on SnapYin homepage\n4) Click Download Now and choose your format\n5) Done! Your video saves to your device.", id: "1) Buka Douyin dan temukan video\n2) Klik Share → Salin Link\n3) Tempel link di halaman utama SnapYin\n4) Klik Unduh Sekarang dan pilih format\n5) Selesai! Video tersimpan ke perangkat Anda.", ru: "1) Откройте Douyin и найдите видео\n2) Поделиться → Скопировать ссылку\n3) Вставьте ссылку на SnapYin\n4) Нажмите «Скачать» и выберите формат\n5) Готово!", zh: "1) 打开抖音找到视频\n2) 点击分享 → 复制链接\n3) 将链接粘贴到 SnapYin 主页\n4) 点击立即下载并选择格式\n5) 完成！视频保存到您的设备。", ar: "1) افتح Douyin وابحث عن الفيديو\n2) اضغط مشاركة ← نسخ الرابط\n3) الصق الرابط في SnapYin\n4) اضغط تنزيل الآن واختر الصيغة\n5) انتهى!" },
  },
  {
    q: { en: "Is it safe to use?", id: "Apakah aman digunakan?", ru: "Безопасно ли это?", zh: "安全使用吗？", ar: "هل هو آمن؟" },
    a: { en: "Yes, 100% safe. We never store your downloaded videos on our servers. No personal data is collected, no login required for basic use, and all connections are SSL encrypted.", id: "Ya, 100% aman. Kami tidak pernah menyimpan video yang diunduh di server kami. Tidak ada data pribadi yang dikumpulkan, tidak perlu login untuk penggunaan dasar, dan semua koneksi dienkripsi SSL.", ru: "Да, безопасно. Видео не хранятся. Личные данные не собираются. Все соединения SSL-зашифрованы.", zh: "是的，100% 安全。我们从不在服务器上存储您下载的视频。不收集个人数据，基本使用无需登录，所有连接均使用 SSL 加密。", ar: "نعم، آمن 100%. لا نخزن مقاطع الفيديو على خوادمنا. لا نجمع بيانات شخصية وجميع الاتصالات مشفرة." },
  },
  {
    q: { en: "Why can't I download a video?", id: "Mengapa tidak bisa mengunduh video?", ru: "Почему не скачивается?", zh: "为什么无法下载视频？", ar: "لماذا لا يمكنني تنزيل الفيديو؟" },
    a: { en: "Possible reasons:\n• The video is private or has been deleted\n• The link is invalid or copied incorrectly\n• Temporary server issue — try again in a moment\n• The video may be region-restricted\n\nIf the problem persists, contact us via email.", id: "Kemungkinan penyebab:\n• Video bersifat privat atau telah dihapus\n• Link tidak valid atau disalin salah\n• Gangguan server sementara — coba beberapa saat lagi\n• Video mungkin dibatasi wilayah\n\nJika masalah berlanjut, hubungi kami via email.", ru: "Возможные причины:\n• Видео приватное или удалено\n• Неверная ссылка\n• Временная ошибка сервера\n• Региональные ограничения\n\nЕсли проблема сохраняется, напишите нам.", zh: "可能的原因：\n• 视频是私密的或已被删除\n• 链接无效或复制有误\n• 临时服务器问题——请稍后再试\n• 视频可能受区域限制\n\n如果问题持续，请通过电子邮件联系我们。", ar: "الأسباب المحتملة:\n• الفيديو خاص أو محذوف\n• رابط غير صالح أو منسوخ بشكل خاطئ\n• عطل مؤقت — حاول مجدداً بعد قليل\n• قيود إقليمية\n\nإذا استمرت المشكلة، تواصل معنا." },
  },
  {
    q: { en: "What formats can I download?", id: "Format apa saja yang bisa diunduh?", ru: "Какие форматы доступны?", zh: "可以下载哪些格式？", ar: "ما هي الصيغ المتاحة للتنزيل؟" },
    a: { en: "SnapYin supports multiple formats:\n• HD Video (MP4, no watermark)\n• Audio only (MP3)\n• Image slideshow (for photo posts)\n\nAll formats are downloaded at the highest quality available.", id: "SnapYin mendukung beberapa format:\n• Video HD (MP4, tanpa watermark)\n• Audio saja (MP3)\n• Slideshow gambar (untuk postingan foto)\n\nSemua format diunduh dengan kualitas tertinggi yang tersedia.", ru: "Доступные форматы:\n• HD видео (MP4, без водяного знака)\n• Только аудио (MP3)\n• Слайдшоу изображений\n\nВсё в максимальном качестве.", zh: "SnapYin 支持多种格式：\n• HD 视频（MP4，无水印）\n• 仅音频（MP3）\n• 图片幻灯片（针对图片帖子）\n\n所有格式均以最高质量下载。", ar: "SnapYin يدعم صيغاً متعددة:\n• فيديو HD (MP4، بدون علامة مائية)\n• صوت فقط (MP3)\n• عرض شرائح الصور\n\nجميع الصيغ بأعلى جودة متاحة." },
  },
];

export default function DouyinFAQPage() {
  const { lang } = useLang();
  return (
    <div className="flex min-h-screen flex-col">
      <DouyinHeader />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-primary/4 blur-3xl pointer-events-none" />
          <div className="container mx-auto max-w-3xl text-center relative">
            <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 p-5 mb-6">
              <HelpCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t(tr.faq_page.title, lang)}</h1>
            <p className="text-muted-foreground text-lg">{t(tr.faq_page.subtitle, lang)}</p>
          </div>
        </div>

        <div className="container mx-auto max-w-3xl px-4 pb-16">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqData.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-2xl px-6 data-[state=open]:bg-muted/30 hover:bg-muted/20 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 text-sm md:text-base">
                  {(item.q as Record<string, string>)[lang] ?? item.q.en}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-sm whitespace-pre-line">
                  {(item.a as Record<string, string>)[lang] ?? item.a.en}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-8 text-center">
            <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 p-4 mb-4">
              <MessageCircle className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t(tr.faq_page.still_q, lang)}</h2>
            <p className="text-muted-foreground text-sm mb-4">{t(tr.faq_page.contact, lang)}</p>
            <a href="mailto:defandryannn@gmail.com" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              defandryannn@gmail.com <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
      <DouyinFooter />
    </div>
  );
}
