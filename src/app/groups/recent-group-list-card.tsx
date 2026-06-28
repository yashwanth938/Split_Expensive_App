import {
  RecentGroup,
  archiveGroup,
  deleteRecentGroup,
  starGroup,
  unarchiveGroup,
  unstarGroup,
} from '@/app/groups/recent-groups-helpers'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { AppRouterOutput } from '@/trpc/routers/_app'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { Calendar, MoreHorizontal, Star, Users } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function RecentGroupListCard({
  group,
  groupDetail,
  isStarred,
  isArchived,
  refreshGroupsFromStorage,
}: {
  group: RecentGroup
  groupDetail?: AppRouterOutput['groups']['list']['groups'][number]
  isStarred: boolean
  isArchived: boolean
  refreshGroupsFromStorage: () => void
}) {
  const router = useRouter()
  const locale = useLocale()
  const toast = useToast()
  const t = useTranslations('Groups')

  return (
    <li key={group.id} className="list-none">
      <div
        className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-card p-5 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer hover:-translate-y-0.5"
        onClick={() => router.push(`/groups/${group.id}`)}
      >
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/groups/${group.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors overflow-hidden text-ellipsis whitespace-nowrap flex-1"
          >
            {group.name}
          </Link>
          
          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={(event) => {
                event.stopPropagation()
                if (isStarred) {
                  unstarGroup(group.id)
                } else {
                  starGroup(group.id)
                  unarchiveGroup(group.id)
                }
                refreshGroupsFromStorage()
              }}
            >
              {isStarred ? (
                <StarFilledIcon className="w-4 h-4 text-amber-500" />
              ) : (
                <Star className="w-4 h-4 text-muted-foreground hover:text-amber-500 transition-colors" />
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border border-slate-100 dark:border-slate-800">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation()
                    deleteRecentGroup(group)
                    refreshGroupsFromStorage()

                    toast.toast({
                      title: t('RecentRemovedToast.title'),
                      description: t('RecentRemovedToast.description'),
                    })
                  }}
                >
                  {t('removeRecent')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation()
                    if (isArchived) {
                      unarchiveGroup(group.id)
                    } else {
                      archiveGroup(group.id)
                      unstarGroup(group.id)
                    }
                    refreshGroupsFromStorage()
                  }}
                >
                  {t(isArchived ? 'unarchive' : 'archive')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="text-muted-foreground font-normal text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60">
          {groupDetail ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <Users className="w-3.5 h-3.5" />
                <span className="font-semibold text-[11px]">{groupDetail._count.participants}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(groupDetail.createdAt).toLocaleDateString(
                    locale,
                    {
                      dateStyle: 'medium',
                    },
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
