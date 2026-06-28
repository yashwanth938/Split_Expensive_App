import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Receipt, Coins, Info, TrendingUp, History, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  groupId: string
}

export function GroupTabs({ groupId }: Props) {
  const t = useTranslations()
  const pathname = usePathname()
  const value =
    pathname.replace(/\/groups\/[^\/]+\/([^/]+).*/, '$1') || 'expenses'
  const router = useRouter()

  const tabItemClass = "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm text-slate-600 dark:text-slate-400"

  return (
    <Tabs
      value={value}
      className="overflow-x-auto no-scrollbar py-1"
      onValueChange={(value) => {
        router.push(`/groups/${groupId}/${value}`)
      }}
    >
      <TabsList className="bg-slate-100/60 dark:bg-slate-800/60 p-1.5 rounded-xl h-11 border border-slate-200/50 dark:border-slate-800/40 w-fit flex gap-1">
        <TabsTrigger value="expenses" className={tabItemClass}>
          <Receipt className="w-3.5 h-3.5" />
          <span>{t('Expenses.title')}</span>
        </TabsTrigger>
        <TabsTrigger value="balances" className={tabItemClass}>
          <Coins className="w-3.5 h-3.5" />
          <span>{t('Balances.title')}</span>
        </TabsTrigger>
        <TabsTrigger value="information" className={tabItemClass}>
          <Info className="w-3.5 h-3.5" />
          <span>{t('Information.title')}</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className={tabItemClass}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{t('Stats.title')}</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className={tabItemClass}>
          <History className="w-3.5 h-3.5" />
          <span>{t('Activity.title')}</span>
        </TabsTrigger>
        <TabsTrigger value="edit" className={tabItemClass}>
          <Settings className="w-3.5 h-3.5" />
          <span>{t('Settings.title')}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
