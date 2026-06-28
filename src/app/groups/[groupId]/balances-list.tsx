import { Balances } from '@/lib/balances'
import { Currency } from '@/lib/currency'
import { cn, formatCurrency } from '@/lib/utils'
import { Participant } from '@prisma/client'
import { useLocale } from 'next-intl'

type Props = {
  balances: Balances
  participants: Participant[]
  currency: Currency
}

export function BalancesList({ balances, participants, currency }: Props) {
  const locale = useLocale()
  const maxBalance = Math.max(
    ...Object.values(balances).map((b) => Math.abs(b.total)),
  )

  return (
    <div className="flex flex-col border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-card overflow-hidden shadow-sm">
      {participants.map((participant, index) => {
        const balance = balances[participant.id]?.total ?? 0
        const isLeft = balance >= 0
        return (
          <div
            key={participant.id}
            className={cn(
              'flex items-center text-sm border-b border-slate-100 dark:border-slate-900 last:border-b-0 py-3.5 px-4 hover:bg-slate-500/[0.01] transition-colors',
              isLeft || 'flex-row-reverse'
            )}
          >
            {/* Participant Name */}
            <div className={cn(
              'w-1/2 font-bold text-slate-700 dark:text-slate-300 px-3', 
              isLeft && 'text-right'
            )}>
              {participant.name}
            </div>

            {/* Balance Bar & Amount */}
            <div className={cn('w-1/2 relative h-8 flex items-center px-3', isLeft || 'text-right justify-end')}>
              <div className={cn(
                "absolute inset-0 px-3 flex items-center z-20 font-extrabold text-[13px] tracking-tight tabular-nums",
                balance === 0 
                  ? "text-slate-400" 
                  : isLeft 
                    ? "text-emerald-700 dark:text-emerald-400" 
                    : "text-rose-700 dark:text-rose-400"
              )}>
                {balance > 0 && '+'}{formatCurrency(currency, balance, locale)}
              </div>
              {balance !== 0 && (
                <div
                  className={cn(
                    'absolute top-0.5 bottom-0.5 z-10 transition-all duration-500',
                    isLeft
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/10 left-0 rounded-r-lg border-y border-r border-emerald-500/20 dark:border-emerald-500/20'
                      : 'bg-rose-500/10 dark:bg-rose-500/10 right-0 rounded-l-lg border-y border-l border-rose-500/20 dark:border-rose-500/20',
                  )}
                  style={{
                    width: `calc(${(Math.abs(balance) / maxBalance) * 100}% - 12px)`,
                  }}
                ></div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
