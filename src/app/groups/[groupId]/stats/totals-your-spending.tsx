'use client'
import { Currency } from '@/lib/currency'
import { cn, formatCurrency } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

import { TrendingUp } from 'lucide-react'

export function TotalsYourSpendings({
  totalParticipantSpendings = 0,
  currency,
}: {
  totalParticipantSpendings?: number
  currency: Currency
}) {
  const locale = useLocale()
  const t = useTranslations('Stats.Totals')

  const balance =
    totalParticipantSpendings < 0 ? 'yourEarnings' : 'yourSpendings'

  return (
    <div className="bg-slate-500/[0.02] border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
        <TrendingUp className="w-5 h-5 text-emerald-500" />
      </div>
      <div>
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{t(balance)}</span>
        <h3 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
          {formatCurrency(currency, Math.abs(totalParticipantSpendings), locale)}
        </h3>
      </div>
    </div>
  )
}
