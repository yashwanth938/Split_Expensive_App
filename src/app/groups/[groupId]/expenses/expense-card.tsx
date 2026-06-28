'use client'
import { ActiveUserBalance } from '@/app/groups/[groupId]/expenses/active-user-balance'
import { CategoryIcon } from '@/app/groups/[groupId]/expenses/category-icon'
import { DocumentsCount } from '@/app/groups/[groupId]/expenses/documents-count'
import { Button } from '@/components/ui/button'
import { getGroupExpenses } from '@/lib/api'
import { Currency } from '@/lib/currency'
import { cn, formatCurrency, formatDateOnly } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment } from 'react'

type Expense = Awaited<ReturnType<typeof getGroupExpenses>>[number]

function Participants({
  expense,
  participantCount,
}: {
  expense: Expense
  participantCount: number
}) {
  const t = useTranslations('ExpenseCard')
  const key = expense.amount > 0 ? 'paidBy' : 'receivedBy'
  const paidFor =
    expense.paidFor.length == participantCount && participantCount >= 4 ? (
      <strong>{t('everyone')}</strong>
    ) : (
      expense.paidFor.map((paidFor, index) => (
        <Fragment key={index}>
          {index !== 0 && <>, </>}
          <strong>{paidFor.participant.name}</strong>
        </Fragment>
      ))
    )

  const participants = t.rich(key, {
    strong: (chunks) => <strong>{chunks}</strong>,
    paidBy: expense.paidBy.name,
    paidFor: () => paidFor,
    forCount: expense.paidFor.length,
  })
  return <>{participants}</>
}

type Props = {
  expense: Expense
  currency: Currency
  groupId: string
  participantCount: number
}

export function ExpenseCard({
  expense,
  currency,
  groupId,
  participantCount,
}: Props) {
  const router = useRouter()
  const locale = useLocale()

  return (
    <div
      key={expense.id}
      className={cn(
        'group flex items-center justify-between p-4 sm:mx-6 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-card hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-md transition-all duration-300 cursor-pointer gap-4',
        expense.isReimbursement && 'bg-blue-500/[0.02] dark:bg-blue-500/[0.01]',
      )}
      onClick={() => {
        router.push(`/groups/${groupId}/expenses/${expense.id}/edit`)
      }}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Category Icon Badge */}
        <div className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-300",
          expense.isReimbursement 
            ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        )}>
          <CategoryIcon
            category={expense.category}
            className="w-5 h-5"
          />
        </div>

        {/* Expense Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className={cn(
            'font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 truncate',
            expense.isReimbursement && 'italic text-indigo-950 dark:text-indigo-200'
          )}>
            {expense.title}
          </div>
          <div className="text-[11px] sm:text-xs text-muted-foreground truncate leading-relaxed">
            <Participants expense={expense} participantCount={participantCount} />
          </div>
          <div className="leading-relaxed">
            <ActiveUserBalance {...{ groupId, currency, expense }} />
          </div>
        </div>
      </div>

      {/* Right side Details */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div
            className={cn(
              'tabular-nums text-sm sm:text-base whitespace-nowrap',
              expense.isReimbursement 
                ? 'italic font-medium text-indigo-600 dark:text-indigo-400' 
                : 'font-extrabold text-slate-800 dark:text-slate-100',
            )}
          >
            {expense.isReimbursement && 'Reimbursement: '}{formatCurrency(currency, expense.amount, locale)}
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400">
            <DocumentsCount count={expense._count.documents} />
            <span>
              {formatDateOnly(expense.expenseDate, locale, { dateStyle: 'medium' })}
            </span>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex flex-shrink-0"
          asChild
        >
          <Link href={`/groups/${groupId}/expenses/${expense.id}/edit`} onClick={(e) => e.stopPropagation()}>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
