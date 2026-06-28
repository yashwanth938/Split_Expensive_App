import { Totals } from '@/app/groups/[groupId]/stats/totals'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTranslations } from 'next-intl'

export function TotalsPageClient() {
  const t = useTranslations('Stats')

  return (
    <>
      <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
        <CardHeader className="pb-4 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-900/60 mb-6 bg-slate-50/50 dark:bg-slate-900/10">
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('Totals.title')}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">{t('Totals.description')}</CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 pt-0">
          <Totals />
        </CardContent>
      </Card>
    </>
  )
}
