'use client'
import { TotalsGroupSpending } from '@/app/groups/[groupId]/stats/totals-group-spending'
import { TotalsYourShare } from '@/app/groups/[groupId]/stats/totals-your-share'
import { TotalsYourSpendings } from '@/app/groups/[groupId]/stats/totals-your-spending'
import { Skeleton } from '@/components/ui/skeleton'
import { useActiveUser } from '@/lib/hooks'
import { getCurrencyFromGroup, formatCurrency } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { useCurrentGroup } from '../current-group-context'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { CategoryIcon } from '@/app/groups/[groupId]/expenses/category-icon'
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react'

export function Totals() {
  const { groupId, group } = useCurrentGroup()
  const activeUser = useActiveUser(groupId)
  const locale = useLocale()
  const t = useTranslations('Stats')

  const participantId =
    activeUser && activeUser !== 'None' ? activeUser : undefined
  const { data } = trpc.groups.stats.get.useQuery({ groupId, participantId })
  const { data: expensesData } = trpc.groups.expenses.list.useQuery({ groupId, limit: 1000 })

  if (!data || !group || !expensesData)
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-20 bg-slate-500/[0.02] border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    )

  const {
    totalGroupSpendings,
    totalParticipantShare,
    totalParticipantSpendings,
  } = data

  const currency = getCurrencyFromGroup(group)

  // 1. Calculate Category breakdown
  const categoryMap: { [key: string]: { amount: number; color: string; category: any } } = {}
  let totalSpending = 0
  const colors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#14b8a6', // teal
  ]
  let colorIdx = 0

  expensesData.expenses.forEach((e) => {
    if (e.isReimbursement) return
    const catLabel = e.category?.name || 'General'
    if (!categoryMap[catLabel]) {
      categoryMap[catLabel] = {
        amount: 0,
        color: colors[colorIdx % colors.length],
        category: e.category,
      }
      colorIdx++
    }
    categoryMap[catLabel].amount += e.amount
    totalSpending += e.amount
  })

  const categoryData = Object.entries(categoryMap)
    .map(([name, val]) => ({
      name,
      amount: val.amount,
      color: val.color,
      category: val.category,
    }))
    .sort((a, b) => b.amount - a.amount)

  // Donut slices
  let accumulatedPercent = 0
  const segments = categoryData.map((c) => {
    const percent = totalSpending > 0 ? (c.amount / totalSpending) * 100 : 0
    const strokeDashArray = `${percent} ${100 - percent}`
    const strokeDashOffset = 100 - accumulatedPercent + 25 // start at 12 o'clock
    accumulatedPercent += percent
    return { ...c, strokeDashArray, strokeDashOffset, percent }
  })

  // 2. Calculate Payer breakdown
  const payerMap: { [name: string]: number } = {}
  expensesData.expenses.forEach((e) => {
    if (e.isReimbursement) return
    const name = e.paidBy.name
    payerMap[name] = (payerMap[name] || 0) + e.amount
  })

  const payersData = Object.entries(payerMap)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)

  const maxPayerAmount = Math.max(...payersData.map((p) => p.amount), 1)

  // 3. Calculate Monthly trend
  const sortedExpenses = [...expensesData.expenses]
    .filter((e) => !e.isReimbursement)
    .sort((a, b) => new Date(a.expenseDate).getTime() - new Date(b.expenseDate).getTime())

  const monthlyMap: { [month: string]: number } = {}
  sortedExpenses.forEach((e) => {
    const date = new Date(e.expenseDate)
    const monthStr = date.toLocaleDateString(locale, { month: 'short', year: '2-digit' })
    monthlyMap[monthStr] = (monthlyMap[monthStr] || 0) + e.amount
  })

  const trendData = Object.entries(monthlyMap).map(([month, amount]) => ({
    label: month,
    amount,
  }))

  const maxTrendAmount = Math.max(...trendData.map((t) => t.amount), 1)

  // Area chart dimensions
  const padding = 30
  const chartWidth = 500
  const chartHeight = 160

  const points = trendData.map((d, idx) => {
    const x = padding + (idx / (trendData.length - 1 || 1)) * (chartWidth - padding * 2)
    const y = chartHeight - padding - (d.amount / maxTrendAmount) * (chartHeight - padding * 2)
    return { x, y }
  })

  const pathD = points.length > 1
    ? points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : ''
  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : ''

  return (
    <div className="flex flex-col gap-8">
      {/* 3 KPI Cards at Top */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <TotalsGroupSpending
          totalGroupSpendings={totalGroupSpendings}
          currency={currency}
        />
        {participantId && (
          <>
            <TotalsYourSpendings
              totalParticipantSpendings={totalParticipantSpendings}
              currency={currency}
            />
            <TotalsYourShare
              totalParticipantShare={totalParticipantShare}
              currency={currency}
            />
          </>
        )}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown (Donut Chart) */}
        <div className="bg-slate-500/[0.01] border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Category breakdown</h3>
          </div>

          {totalSpending > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* SVG Donut Chart */}
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="2.8"
                    className="dark:stroke-slate-800"
                  />
                  {segments.map((seg, i) => (
                    <circle
                      key={i}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="3.6"
                      strokeDasharray={seg.strokeDashArray}
                      strokeDashoffset={seg.strokeDashOffset}
                      className="transition-all duration-300 ease-out hover:stroke-[4.2] cursor-pointer"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total</span>
                  <span className="text-base font-black text-slate-800 dark:text-slate-100 font-mono mt-0.5">
                    {formatCurrency(currency, totalSpending, locale)}
                  </span>
                </div>
              </div>

              {/* Progress bars list */}
              <div className="flex flex-col gap-4 w-full">
                {segments.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <CategoryIcon category={item.category} className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                      </div>
                      <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                        {item.percent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-xs text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No spendings to analyze
            </div>
          )}
        </div>

        {/* Payer breakdown & Monthly trends */}
        <div className="flex flex-col gap-8">
          {/* Payer Breakdown */}
          <div className="bg-slate-500/[0.01] border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Spendings by payer</h3>
            </div>

            {payersData.length > 0 ? (
              <div className="flex flex-col gap-4">
                {payersData.map((payer, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{payer.name}</span>
                      <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                        {formatCurrency(currency, payer.amount, locale)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${(payer.amount / maxPayerAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-xs text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No payer data available
              </div>
            )}
          </div>

          {/* Spending Trend (Area Chart) */}
          <div className="bg-slate-500/[0.01] border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Spending over time</h3>
            </div>

            {trendData.length > 1 ? (
              <div className="w-full overflow-hidden">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                  <defs>
                    <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line
                    x1={padding}
                    y1={padding}
                    x2={chartWidth - padding}
                    y2={padding}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    className="dark:stroke-slate-800/40"
                  />
                  <line
                    x1={padding}
                    y1={chartHeight / 2}
                    x2={chartWidth - padding}
                    y2={chartHeight / 2}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    className="dark:stroke-slate-800/40"
                  />
                  <line
                    x1={padding}
                    y1={chartHeight - padding}
                    x2={chartWidth - padding}
                    y2={chartHeight - padding}
                    stroke="#e2e8f0"
                    className="dark:stroke-slate-800/85"
                  />

                  {/* Area fill */}
                  <path d={areaD} fill="url(#area-gradient)" />

                  {/* Area stroke line */}
                  <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" />

                  {/* Trend values */}
                  {points.map((p, idx) => (
                    <g key={idx} className="group">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#3b82f6"
                        className="transition-all duration-200 cursor-pointer hover:r-5"
                      />
                      <circle cx={p.x} cy={p.y} r="1.5" fill="#ffffff" />
                      <text
                        x={p.x}
                        y={chartHeight - 10}
                        textAnchor="middle"
                        className="text-[9px] fill-slate-400 dark:fill-slate-500 font-semibold"
                      >
                        {trendData[idx].label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-xs text-muted-foreground border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                Not enough data to display trend
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
