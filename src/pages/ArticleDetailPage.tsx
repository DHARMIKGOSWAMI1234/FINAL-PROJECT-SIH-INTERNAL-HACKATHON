import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import {
  INSIGHTS_ARTICLES,
  InsightCategory,
  getLocalizedArticle,
  DisplayArticle,
} from '../data/insights';
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Sparkles,
  Share2,
  Bookmark,
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

export const ArticleDetailPage: React.FC = () => {
  const { id, articleId } = useParams<{ id?: string; articleId?: string }>();
  const activeId = articleId || id;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isArticleFav, toggleArticle } = useFavorites();
  const { showToast } = useToast();

  // Scroll to top whenever article ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeId]);

  // Find the active article and localize it reactively based on language
  const article: DisplayArticle | undefined = useMemo(() => {
    const raw = INSIGHTS_ARTICLES.find((a) => a.id === activeId) || INSIGHTS_ARTICLES[0];
    return raw ? getLocalizedArticle(raw, language) : undefined;
  }, [activeId, language]);

  // Find related articles and localize them
  const relatedArticles: DisplayArticle[] = useMemo(() => {
    if (!article) return [];
    const rawRelated = INSIGHTS_ARTICLES.filter((a) =>
      article.relatedArticleIds?.includes(a.id)
    );
    const list = rawRelated.length > 0 ? rawRelated : INSIGHTS_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);
    return list.map((a) => getLocalizedArticle(a, language));
  }, [article, language]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F2F1EC] dark:bg-[#080C0E] pt-32 pb-24 text-center text-[#17212B] dark:text-[#F8FAFC]">
        <h2 className="text-xl font-bold mb-4">{t('insights.articleNotFound', 'Article Not Found')}</h2>
        <button
          onClick={() => navigate('/insights')}
          className="px-4 py-2 bg-[#17212B] dark:bg-[#151E24] text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          {t('insights.backToHub', 'Back to Insights Library')}
        </button>
      </div>
    );
  }

  const isFav = isArticleFav(article.id);

  // Helper for category badge styling
  const getCategoryBadgeClass = (cat: InsightCategory | string) => {
    switch (cat) {
      case 'soil-npk':
        return 'bg-amber-500/10 text-[#F59E0B] border-amber-500/30';
      case 'crop-management':
        return 'bg-emerald-500/10 text-[#10B981] border-emerald-500/30';
      case 'fertilizers':
        return 'bg-purple-500/10 text-[#8B5CF6] border-purple-500/30';
      case 'weather-irrigation':
        return 'bg-cyan-500/10 text-[#06B6D4] border-cyan-500/30';
      case 'sustainable-farming':
        return 'bg-blue-500/10 text-[#3B82F6] border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-400/30';
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        t('insights.linkCopied', 'Link Copied'),
        t('insights.linkCopiedDesc', 'Article link copied to clipboard'),
        'info'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F1EC] dark:bg-[#080C0E] text-[#17212B] dark:text-[#F8FAFC] transition-colors duration-300 pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* ── BREADCRUMB & BACK ACTION ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate('/insights')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#596773] dark:text-[#94A3B8] hover:text-[#06B6D4] dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('insights.backToHub', 'Back to Insights Library')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleArticle(article.id)}
              className={`p-2 rounded-xl border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#0F161A] text-xs font-semibold transition-all cursor-pointer ${
                isFav
                  ? 'text-[#F59E0B] border-amber-500/40 bg-amber-500/10'
                  : 'text-[#596773] dark:text-[#94A3B8] hover:text-[#17212B] dark:hover:text-[#F8FAFC]'
              }`}
              title={t('insights.bookmark', 'Bookmark')}
            >
              <Bookmark className={`h-4 w-4 ${isFav ? 'fill-[#F59E0B]' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-[#D6D8D3] dark:border-white/10 bg-[#F8F8F4] dark:bg-[#0F161A] text-[#596773] dark:text-[#94A3B8] hover:text-[#17212B] dark:hover:text-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer"
              title={t('insights.share', 'Share')}
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── ARTICLE HEADER ── */}
        <header className="space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border shadow-sm ${getCategoryBadgeClass(article.category)}`}>
              {article.categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#77838D] dark:text-[#94A3B8] font-mono">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
            <span className="text-[#D6D8D3] dark:text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-xs text-[#77838D] dark:text-[#94A3B8] font-mono">
              <Calendar className="h-3.5 w-3.5" />
              {article.publishedDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#17212B] dark:text-[#F8FAFC] leading-[1.15]">
            {article.title}
          </h1>

          {/* Author info pill */}
          <div className="pt-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {article.author.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-[#17212B] dark:text-[#F8FAFC]">
                {article.author}
              </div>
              <div className="text-[11px] text-[#77838D] dark:text-[#94A3B8]">
                {article.authorRole}
              </div>
            </div>
          </div>
        </header>

        {/* ── HERO IMAGE ── */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] w-full bg-[#0B1115] border border-[#D6D8D3] dark:border-white/10 shadow-lg relative">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* ── ARTICLE BODY CONTENT ── */}
        <article className="space-y-8 text-[#17212B] dark:text-[#F8FAFC]">
          
          {/* Highlighted Lead Introduction */}
          <div className="p-6 rounded-2xl bg-[#F8F8F4] dark:bg-[#0F161A] border-l-4 border-[#06B6D4] border-y border-r border-[#D6D8D3] dark:border-white/10 text-sm sm:text-base text-[#17212B] dark:text-[#F8FAFC] font-medium leading-relaxed shadow-sm">
            {article.introduction}
          </div>

          {/* Main Sections */}
          <div className="space-y-8 pt-2">
            {article.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17212B] dark:text-[#F8FAFC]">
                  {section.heading}
                </h2>

                {section.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.listItems && section.listItems.length > 0 && (
                  <ul className="space-y-2.5 pt-2 pl-2">
                    {section.listItems.map((item, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-[#06B6D4] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* ── PRACTICAL FARMER TIPS CARD ── */}
          {article.practicalTips && article.practicalTips.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/[0.04] dark:bg-amber-500/[0.06] border border-amber-500/20 space-y-4">
              <div className="flex items-center gap-2 text-[#F59E0B]">
                <Lightbulb className="h-5 w-5" />
                <h3 className="text-base font-bold text-[#17212B] dark:text-[#F8FAFC]">
                  {t('insights.practicalDirectives', 'Practical Field Directives')}
                </h3>
              </div>
              <ul className="space-y-3">
                {article.practicalTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                    <span className="font-mono text-xs font-bold text-[#F59E0B] mt-0.5">0{idx + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── KEY TAKEAWAYS CARD ── */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#06B6D4]">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="text-base font-bold text-[#17212B] dark:text-[#F8FAFC]">
                  {t('insights.keyTakeaways', 'Key Agronomy Takeaways')}
                </h3>
              </div>
              <ul className="space-y-3">
                {article.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#596773] dark:text-[#94A3B8] leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-[#06B6D4] mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </article>

        {/* ── RELATED ARTICLES GRID ── */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-[#D6D8D3] dark:border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#06B6D4]" />
                <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F8FAFC]">
                  {t('insights.relatedGuides', 'Related Agronomy Guides')}
                </h3>
              </div>
              <Link
                to="/insights"
                className="text-xs font-semibold text-[#06B6D4] hover:underline"
              >
                {t('insights.viewAllGuides', 'View all guides →')}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/insights/${rel.id}`)}
                  className="group rounded-2xl overflow-hidden bg-[#F8F8F4] dark:bg-[#0F161A] border border-[#D6D8D3] dark:border-white/[0.08] hover:border-[#06B6D4]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[#0B1115]">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getCategoryBadgeClass(rel.category)}`}>
                        {rel.categoryLabel}
                      </span>
                      <h4 className="text-xs font-bold text-[#17212B] dark:text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                  </div>

                  <div className="px-4 pb-3 flex items-center justify-between text-[11px] text-[#77838D] dark:text-[#94A3B8]">
                    <span>{rel.readTime}</span>
                    <ArrowRight className="h-3 w-3 text-[#06B6D4] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AGRISENSE AI BANNER ── */}
        <div className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden bg-gradient-to-br from-[#17212B] to-[#0F161A] dark:from-[#0F161A] dark:to-[#151E24] border border-slate-700/60 dark:border-white/10 shadow-2xl text-white">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t('insights.aiCtaBadge', 'AI Agronomy Engine')}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              {t('insights.readyToTest', 'Ready to test your soil?')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('insights.readyToTestDesc', 'Use AGRISENSE AI to analyze your exact N-P-K levels, soil pH, and local weather conditions to receive an optimal fertilizer dosage schedule.')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/advisor')}
                className="px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#22D3EE] hover:to-[#3B82F6] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-glow-cyan cursor-pointer inline-flex items-center gap-2"
              >
                <span>{t('insights.aiCtaButton', 'Start Soil Analysis')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
