'use client'
import { Currency } from '@/lib/currency'
import { cn, formatCurrency } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'

import { Scale } from 'lucide-react'

export function TotalsYourShare({
  totalParticipantShare = 0,
  currency,
}: {
  totalParticipantShare?: number
  currency: Currency
}) {
  const locale = useLocale()
  const t = useTranslations('Stats.Totals')

  return (
    <div className="bg-slate-500/[0.02] border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
        <Scale className="w-5 h-5 text-amber-500" />
      </div>
      <div>
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{t('yourShare')}</span>
        <h3 className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
          {formatCurrency(currency, Math.abs(totalParticipantShare), locale)}
        </h3>
      </div>
    </div>
  )
}
