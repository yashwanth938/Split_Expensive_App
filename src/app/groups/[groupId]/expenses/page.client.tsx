'use client'

import { ActiveUserModal } from '@/app/groups/[groupId]/expenses/active-user-modal'
import { CreateFromReceiptButton } from '@/app/groups/[groupId]/expenses/create-from-receipt-button'
import { ExpenseList } from '@/app/groups/[groupId]/expenses/expense-list'
import ExportButton from '@/app/groups/[groupId]/export-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useCurrentGroup } from '../current-group-context'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Expenses',
}

export default function GroupExpensesPageClient({
  enableReceiptExtract,
}: {
  enableReceiptExtract: boolean
}) {
  const t = useTranslations('Expenses')
  const { groupId } = useCurrentGroup()

  return (
    <>
      <Card className="mb-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 p-5 sm:p-6 gap-4">
          <div className="flex-1 flex flex-col gap-0.5">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('title')}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">{t('description')}</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ExportButton groupId={groupId} />
            {enableReceiptExtract && <CreateFromReceiptButton />}
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition-all duration-300 shadow-sm gap-1.5 px-3.5 sm:px-4 h-9 rounded-lg">
              <Link
                href={`/groups/${groupId}/expenses/create`}
                title={t('create')}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-semibold">{t('create')}</span>
              </Link>
            </Button>
          </div>
        </div>

        <CardContent className="p-0 pb-4 sm:pb-6 flex flex-col gap-4 relative">
          <ExpenseList />
        </CardContent>
      </Card>

      <ActiveUserModal groupId={groupId} />
    </>
  )
}
