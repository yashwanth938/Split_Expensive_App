import { Button } from '@/components/ui/button'
import { Github, Users, Link2, Coins, ArrowRight, Sparkles, Receipt, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'


export default function HomePage() {
  const t = useTranslations()
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-radial-subtle">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-[80px]" />
      <div className="absolute top-10 left-10 -z-10 h-48 w-48 rounded-full bg-cyan-400/15 dark:bg-cyan-500/5 blur-[60px] animate-float" />
      <div className="absolute bottom-20 right-10 -z-10 h-64 w-64 rounded-full bg-teal-400/15 dark:bg-teal-500/5 blur-[80px]" />

      <section className="py-20 md:py-32 lg:py-40 animate-fade-in">
        <div className="container flex max-w-5xl flex-col items-center gap-6 text-center px-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Introducing a smarter way to split</span>
          </div>

          {/* Heading */}
          <h1 className="leading-tight font-extrabold text-3xl sm:text-5xl md:text-6xl py-2 max-w-3xl landing-header">
            {t.rich('Homepage.title', {
              strong: (chunks) => <strong className="text-emerald-700 dark:text-emerald-300">{chunks}</strong>,
            })}
          </h1>

          {/* Subtitle */}
          <p className="max-w-[46rem] text-sm sm:text-lg text-muted-foreground leading-relaxed sm:leading-8">
            {t.rich('Homepage.description', {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild size="lg" className="px-8 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 font-semibold group">
              <Link href="/groups" className="flex items-center gap-2">
                {t('Homepage.button.groups')}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-300">
              <Link href="https://github.com/yashwanth938/Split_Expensive_App" target="_blank">
                <Github className="w-4 h-4 mr-2" />
                {t('Homepage.button.github')}
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-24">
            
            <div className="glass-card rounded-2xl p-6 text-left flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No Account Required</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Start splitting expenses instantly without logging in. Your browser saves your recent groups.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 text-left flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Link2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Share with a Link</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Simply share the unique URL with your friends so they can add expenses and view group balances.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 text-left flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Uneven Splits</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Split costs evenly, by custom shares, by percentages, or exact amounts to match any scenario.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 text-left flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Coins className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">Easy Settlement</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get optimized payment steps indicating exactly who owes whom, minimizing transactions.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  )
}
