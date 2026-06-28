'use client'

import { GroupTabs } from '@/app/groups/[groupId]/group-tabs'
import { ShareButton } from '@/app/groups/[groupId]/share-button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useCurrentGroup } from './current-group-context'


export const GroupHeader = () => {
  const { isLoading, groupId, group } = useCurrentGroup()

  return (
    <div className="flex flex-col gap-5 border-b border-slate-100 dark:border-slate-800 pb-4">
      <div className="flex items-center gap-3">
        <Link
          href="/groups"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-foreground transition-all"
          title="Back to Groups"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-slate-100 flex-1">
          {isLoading ? (
            <Skeleton className="h-6 w-48 rounded-md mt-1" />
          ) : (
            <span className="flex items-center gap-2">{group.name}</span>
          )}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <GroupTabs groupId={groupId} />
        <div className="flex items-center justify-end">
          {group && <ShareButton group={group} />}
        </div>
      </div>
    </div>
  )
}
