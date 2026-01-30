import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { type DistributionItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface DistributionChartProps {
  data: DistributionItem[] | undefined;
  isLoading: boolean;
}

export function DistributionChart({ data, isLoading }: DistributionChartProps) {
  // Sort data and take top 20 for cleaner visualization
  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.count - a.count).slice(0, 20);
  }, [data]);

  if (isLoading) {
    return (
      <Card className="h-[500px] w-full flex items-center justify-center border-border/50 shadow-sm">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="h-[500px] w-full flex flex-col items-center justify-center border-dashed border-2 bg-muted/20">
        <div className="bg-background p-4 rounded-full shadow-sm mb-4">
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">No Data Yet</h3>
        <p className="text-muted-foreground mt-2 text-center max-w-sm">
          Add some text entries using the panel on the right to see the distribution visualization.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-lg shadow-black/5 overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl">Term Distribution</CardTitle>
            <CardDescription>Top 20 most frequent terms in your dataset</CardDescription>
          </div>
          <div className="text-sm font-medium bg-background px-3 py-1 rounded-full border shadow-sm">
            Total Unique Terms: {data?.length || 0}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="term" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg shadow-xl p-3 animate-in fade-in zoom-in-95 duration-200">
                        <p className="font-bold text-foreground mb-1">{label}</p>
                        <p className="text-primary font-medium">
                          Count: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#colorCount)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
