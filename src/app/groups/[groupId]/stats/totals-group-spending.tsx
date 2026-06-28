import { Currency } from '@/lib/currency'
import { formatCurrency } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { Coins } from 'lucide-react'

type Props = {
  totalGroupSpendings: number
  currency: Currency
}

export function TotalsGroupSpending({ totalGroupSpendings, currency }: Props) {
  const locale = useLocale()
  const t = useTranslations('Stats.Totals')
  const balance = totalGroupSpendings < 0 ? 'groupEarnings' : 'groupSpendings'
  return (
    <div className="bg-slate-500/[0.02] border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
        <Coins className="w-5 h-5 text-blue-500" />
      </div>
      <div>
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">{t(balance)}</span>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
          {formatCurrency(currency, Math.abs(totalGroupSpendings), locale)}
        </h3>
      </div>
    </div>
  )
}
