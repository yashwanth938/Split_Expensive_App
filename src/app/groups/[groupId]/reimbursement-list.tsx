import { Button } from '@/components/ui/button'
import { Reimbursement } from '@/lib/balances'
import { Currency } from '@/lib/currency'
import { formatCurrency } from '@/lib/utils'
import { Participant } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

type Props = {
  reimbursements: Reimbursement[]
  participants: Participant[]
  currency: Currency
  groupId: string
}

import { ArrowRight, Coins } from 'lucide-react'

export function ReimbursementList({
  reimbursements,
  participants,
  currency,
  groupId,
}: Props) {
  const locale = useLocale()
  const t = useTranslations('Balances.Reimbursements')
  if (reimbursements.length === 0) {
    return <p className="text-sm pb-6 text-muted-foreground text-center">{t('noImbursements')}</p>
  }

  const getParticipant = (id: string) => participants.find((p) => p.id === id)
  return (
    <div className="flex flex-col border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-card overflow-hidden shadow-sm">
      {reimbursements.map((reimbursement, index) => {
        const fromName = getParticipant(reimbursement.from)?.name ?? ''
        const toName = getParticipant(reimbursement.to)?.name ?? ''
        return (
          <div 
            className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-900 last:border-b-0 p-4 gap-4 hover:bg-slate-500/[0.01] transition-colors" 
            key={index}
          >
            {/* Transfer Visual Description */}
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 min-w-0 truncate">
                <span className="font-extrabold truncate max-w-[120px]">{fromName}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-extrabold truncate max-w-[120px] text-emerald-600 dark:text-emerald-400">{toName}</span>
              </div>
            </div>

            {/* Amount & Settlement Action */}
            <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
              <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
                {formatCurrency(currency, reimbursement.amount, locale)}
              </div>
              <Button variant="outline" asChild className="h-8 text-xs font-semibold px-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/20 rounded-lg transition-all">
                <Link
                  href={`/groups/${groupId}/expenses/create?reimbursement=yes&from=${reimbursement.from}&to=${reimbursement.to}&amount=${reimbursement.amount}`}
                >
                  {t('markAsPaid')}
                </Link>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
