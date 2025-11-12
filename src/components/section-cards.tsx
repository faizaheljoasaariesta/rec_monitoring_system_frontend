import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchSummary } from "@/services/api/report"

interface SummaryData {
  total_tests: number
  total_ok: number
  total_ng: number
  total_retry: number
}

export function SectionCards() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchSummary()
        setSummary(result)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const total_tests = summary?.total_tests ?? 0
  const total_ok = summary?.total_ok ?? 0
  const total_ng = summary?.total_ng ?? 0
  const total_retry = summary?.total_retry ?? 0

  const okRate = total_tests ? (total_ok / total_tests) * 100 : 0
  const ngRate = total_tests ? (total_ng / total_tests) * 100 : 0
  const retryRate = total_tests ? (total_retry / total_tests) * 100 : 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Test</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Skeleton className="mt-1 h-8 w-24 rounded-full" />
            ) : (
              total_tests.toLocaleString()
            )}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {loading ? (
            <Skeleton className="h-5 w-3/4 rounded-full" />
          ) : (
            <div className="flex gap-2 font-medium">
              Trending up this month <IconTrendingUp className="size-4" />
            </div>
          )}
          {loading ? (
            <Skeleton className="h-5 w-4/5 rounded-full" />
          ) : (
            <div className="text-muted-foreground">
              Testing for the last all months
            </div>
          )} 
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>(OK) Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Skeleton className="mt-1 h-8 w-24 rounded-full" />
            ) : (
              `${okRate.toFixed(2)}%`
            )}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant="outline">
                <IconTrendingDown />
                -1.1%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {loading ? (
            <Skeleton className="h-5 w-3/4 rounded-full" />
          ) : (
            <div className="flex gap-2 font-medium">
              (OK) Rate Decreased <IconTrendingDown className="size-4" />
            </div>
          )}
          {loading ? (
            <Skeleton className="h-5 w-4/5 rounded-full" />
          ) : (
            <div className="text-muted-foreground">
              Improving performance
            </div>
          )} 
        </CardFooter>
      </Card>

      {/* Card: NG Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>(NG) Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Skeleton className="mt-1 h-8 w-24 rounded-full" />
            ) : (
              `${ngRate.toFixed(2)}%`
            )}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant="outline">
                <IconTrendingUp />
                +2.5%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {loading ? (
            <Skeleton className="h-5 w-3/4 rounded-full" />
          ) : (
            <div className="flex gap-2 font-medium">
              (NG) Rate Increased <IconTrendingUp className="size-4" />
            </div>
          )}
          {loading ? (
            <Skeleton className="h-5 w-4/5 rounded-full" />
          ) : (
            <div className="text-muted-foreground">Needs attention</div>
          )} 
        </CardFooter>
      </Card>

      {/* Card: Retry Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>(Retry) Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Skeleton className="mt-1 h-8 w-24 rounded-full" />
            ) : (
              `${retryRate.toFixed(2)}%`
            )}
          </CardTitle>
          <CardAction>
            {loading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <Badge variant="outline">
                <IconTrendingUp />
                +0%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {loading ? (
            <Skeleton className="h-5 w-3/4 rounded-full" />
          ) : (
            <div className="flex gap-2 font-medium">
              Retry Rate Steady <IconTrendingUp className="size-4" />
            </div>
          )}
          {loading ? (
            <Skeleton className="h-5 w-4/5 rounded-full" />
          ) : (
            <div className="text-muted-foreground">Stable month-to-month</div>
          )} 
        </CardFooter>
      </Card>
    </div>
  )
}
