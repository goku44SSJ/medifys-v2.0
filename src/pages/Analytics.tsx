import { useMemo, useState } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Footprints, HeartPulse, Moon, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { useStore, selectAdherence } from "@/store/useStore";
import { healthMetrics } from "@/lib/mock-data";

type Range = "week" | "month" | "quarter" | "year";
const rangeToDays: Record<Range, number> = { week: 7, month: 30, quarter: 60, year: 60 };

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs shadow-lift dark:border-ink-700 dark:bg-ink-850">
      <p className="mb-1 font-medium text-ink-500">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function Analytics() {
  const [range, setRange] = useState<Range>("month");
  const adherence = useStore(selectAdherence);

  const data = useMemo(() => {
    const n = rangeToDays[range];
    return healthMetrics.slice(-n).map((d) => ({
      ...d,
      label: new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    }));
  }, [range]);

  const avgSteps = Math.round(data.reduce((a, b) => a + b.steps, 0) / data.length);
  const prevAvgSteps = Math.round(
    healthMetrics.slice(-(rangeToDays[range] * 2), -rangeToDays[range]).reduce((a, b) => a + b.steps, 0) /
      Math.max(1, healthMetrics.slice(-(rangeToDays[range] * 2), -rangeToDays[range]).length)
  );
  const stepsChange = prevAvgSteps ? Math.round(((avgSteps - prevAvgSteps) / prevAvgSteps) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Health Analytics</h2>
          <p className="text-ink-500 dark:text-ink-400">Trends across activity, heart rate, sleep and more.</p>
        </div>
        <Tabs
          tabs={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "quarter", label: "Quarter" },
            { value: "year", label: "Year" },
          ]}
          defaultValue={range}
          onChange={(v) => setRange(v as Range)}
        />
      </div>

      <Card className="border-vital-200 bg-vital-50/60 dark:border-vital-800 dark:bg-vital-900/20">
        <CardContent className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vital-600 text-white">
            <TrendingUp size={18} />
          </div>
          <p className="text-sm text-ink-700 dark:text-ink-200">
            Your average activity {stepsChange >= 0 ? "increased" : "decreased"}{" "}
            <span className="font-semibold">{Math.abs(stepsChange)}%</span> compared to the previous {range}. Medication
            adherence is holding steady at <span className="font-semibold">{adherence}%</span>.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="mb-3 flex items-center gap-2 text-ink-700 dark:text-ink-200">
              <Footprints size={16} className="text-vital-500" />
              <p className="text-sm font-semibold">Steps</p>
              <span className="ml-auto text-xs text-ink-400">avg {avgSteps.toLocaleString()}/day</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="steps-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3F79D6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3F79D6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="steps" name="Steps" stroke="#3F79D6" fill="url(#steps-fill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-3 flex items-center gap-2 text-ink-700 dark:text-ink-200">
              <HeartPulse size={16} className="text-coral-500" />
              <p className="text-sm font-semibold">Resting heart rate</p>
              <span className="ml-auto text-xs text-ink-400">bpm</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis domain={["dataMin - 4", "dataMax + 4"]} tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="heartRate" name="BPM" stroke="#E15540" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-3 flex items-center gap-2 text-ink-700 dark:text-ink-200">
              <Moon size={16} className="text-vital-500" />
              <p className="text-sm font-semibold">Sleep</p>
              <span className="ml-auto text-xs text-ink-400">hours</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="sleepHours" name="Sleep" fill="#8FB8F0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-3 flex items-center gap-2 text-ink-700 dark:text-ink-200">
              <Scale size={16} className="text-clover-600" />
              <p className="text-sm font-semibold">Weight</p>
              <span className="ml-auto text-xs text-ink-400">kg</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 11, fill: "#8792A2" }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="weightKg" name="Weight" stroke="#1E9E7C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
