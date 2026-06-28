'use client'
import { CopyButton } from '@/components/copy-button'
import { ShareUrlButton } from '@/components/share-url-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useBaseUrl } from '@/lib/hooks'
import { Group } from '@prisma/client'
import { Share } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {
  group: Group
}

export function ShareButton({ group }: Props) {
  const t = useTranslations('Share')
  const baseUrl = useBaseUrl()
  const url = baseUrl && `${baseUrl}/groups/${group.id}/expenses?ref=share`

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          title={t('title')} 
          variant="outline"
          className="flex-shrink-0 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 font-medium px-3.5 shadow-sm transition-all"
        >
          <Share className="w-4 h-4" />
          <span className="text-xs font-semibold">{t('title')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] sm:w-[380px] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-xl [&_p]:text-sm flex flex-col gap-4 z-50">
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{t('title')}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{t('description')}</p>
        </div>
        
        {url && (
          <div className="flex gap-1.5 items-center">
            <Input className="flex-1 text-xs h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono" defaultValue={url} readOnly />
            <CopyButton text={url} />
            <ShareUrlButton
              text={`Join my group ${group.name} on Spliit`}
              url={url}
            />
          </div>
        )}
        
        <div className="rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/25 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          <strong className="font-bold block mb-0.5">{t('warning')}</strong>
          {t('warningHelp')}
        </div>
      </PopoverContent>
    </Popover>
  )
}
