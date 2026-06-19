"use client";

import {useEffect, useState } from "react";
import ChartCard, { Bar, Line, Doughnut } from "../../components/ChartCard";

const API_BASE = "http://127.0.0.1:8000/api";

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const endpoints = [
                    "kpis",
                    "weather-stats",
                    "vehicle-stats",
                    "priority-stats",
                    "weekday-delay",
                    "week-total-delay",
                    "month-total-delay",
                    "rating-summary",
                ];

                const responses = await Promise.all(
                    endpoints.map((endpoint) => fetch(`${API_BASE}/${endpoint}`))
                );

                for (const res of responses) {
                    if (!res.ok) throw new Error("Failed to fetch dashboard data");
                }

                const [
                    kpis,
                    weatherStats,
                    vehicleStats,
                    priorityStats,
                    weekdayDelay,
                    weekTotalDelay,
                    monthTotalDelay,
                    ratingSummary,
                ] = await Promise.all(responses.map((res) => res.json()));

                setData({
                    kpis: kpis[0],
                    weatherStats,
                    vehicleStats,
                    priorityStats,
                    weekdayDelay,
                    weekTotalDelay,
                    monthTotalDelay,
                    ratingSummary,
                })
            } catch(err) {
                setError(err.message);
            }
        }

        fetchDashboardData();

    }, []);

    if (error) return <main className="p-8 text-red-500">Error: {error}</main>;
    if (!data) return <main className="p-8">Loading dashboard...</main>;

    const gridColor = "#1d2838";

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#cbd5e1",
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "#cbd5e1" },
            },
            y: {
                ticks: { color: "#cbd5e1" },
                grid: { color: gridColor },
            },
        },
    };

    const noLegendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            display: false,
            },
        },
        scales: {
            x: {
            ticks: { color: "#cbd5e1" },
            grid: { color: gridColor },
            },
            y: {
            ticks: { color: "#cbd5e1" },
            grid: { color: gridColor },
            },
        },
    };

    const customGridlineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#cbd5e1",
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "#cbd5e1" },
            },
            y: {
                ticks: { color: "#cbd5e1" },
                grid: { color: gridColor },
            },
        },
    };


    const horizontalBarChartOptions  ={
        ...noLegendChartOptions,
        indexAxis: "y",
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            labels: {
                color: "#cbd5e1",
            },
            },
        },
    };

    return (
        <main className="min-h-screen bg-slate-950 p-5 text-white">
            <h1 className="mb-1 text-2xl font-bold">Delivery Performance Dashboard</h1>
            <p className="mb-5 text-sm text-slate-400">
                Overview of delivery performance metrics.
            </p>

            <section className="grid grid-cols-3 gap-4">

                <KpiCard title="Total Deliveries" value={data.kpis.total_deliveries} />
                <KpiCard title="Overall Median Delay" value={`${data.kpis.median_delay_mins} mins`} />
                <KpiCard title="On-Time Percentage" value={`${data.kpis.on_time_percentage}%`} />


            
                <ChartCard title="Vehicle Type Proportion" className="h-[370px]">
                    <div className="flex h-full items-center justify-center">
                        <div className="h-[300px] w-[300px]">

                            <Doughnut
                                options={doughnutOptions}
                                data={{
                                    labels: data.vehicleStats.map((item) => item.vehicle_type),
                                    datasets: [
                                        {
                                            data: data.vehicleStats.map((item) => item.proportion),
                                            backgroundColor: [
                                                "#3F51B5",
                                                "#673AB7",
                                                "#9C27B0",
                                            ],
                                            borderColor: "#0f172a",
                                            borderWidth: 4,
                                        },
                                    ],
                                }}
                            />

                        </div>
                    </div>
                </ChartCard>

                
                <ChartCard title="Median Delay by Weekday (mins.)" className="h-[370px]">
                <Bar
                    options={noLegendChartOptions}
                    data={{
                        labels: data.weekdayDelay.map((item) => item.weekday),
                        datasets: [
                            {
                            label: "Median delay",
                            data: data.weekdayDelay.map((item) => item.median_delay_mins),
                            backgroundColor: "#7033b6",
                            },
                        ],
                    }}
                />
                </ChartCard>


                <ChartCard title="Median Delay by Weather (mins.)" className="h-[370px]">
                <Bar
                    options={noLegendChartOptions}
                    data={{
                        labels: data.weatherStats.map((item) => item.weather),
                        datasets: [
                            {
                            label: "Median delay (mins)",
                            data: data.weatherStats.map((item) => item.median_delay_mins),
                            backgroundColor: [
                                "#FF9800",
                                "#3F51B5",
                            ],
                            },
                        ],
                    }}
                />
                </ChartCard>

                <div className="col-span-3 grid h-[520px] grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] gap-4">

                    <div className="grid min-w-0 min-h-0 grid-rows-2 gap-4">
                        <ChartCard title="Weekly Total Delay" className="min-h-0">
                            <Line
                                options={customGridlineChartOptions}
                                data={{
                                    labels: data.weekTotalDelay.map((item) =>
                                        new Date(item.week_start).toLocaleDateString()
                                    ),
                                    datasets: [
                                        {
                                        label: "Total delay (mins)",
                                        data: data.weekTotalDelay.map((item) => item.total_delay_mins),
                                        backgroundColor: "#b66060",
                                        borderColor: "#b66060",
                                        tension: 0.67,
                                        },
                                    ],
                                }}
                            />
                        </ChartCard>


                        <ChartCard title="Monthly Total Delay" className="min-h-0">
                            <Line
                                options={chartOptions}
                                data={{
                                    labels: data.monthTotalDelay.map((item) =>
                                        new Date(item.month_start).toLocaleDateString()
                                    ),
                                    datasets: [
                                        {
                                        label: "Total delay (mins)",
                                        data: data.monthTotalDelay.map((item) => item.total_delay_mins),
                                        backgroundColor: "#01579B",
                                        borderColor: "#01579B",
                                        tension: 0.3,
                                        },
                                    ],
                                }}
                            />
                        </ChartCard>
                    </div>

                    <ChartCard title="Average Driver Ratings" className="min-w-0 h-full">
                        <Bar
                            options={horizontalBarChartOptions}
                            data={{
                                labels: data.ratingSummary.map((item) => item.rating_name),
                                datasets: [
                                    {
                                    label: "Average rating",
                                    data: data.ratingSummary.map((item) => item.average),
                                    backgroundColor: [
                                        "#FFE0B2",
                                        "#F57C00",
                                        "#FF9800",
                                        "#FFB74D",
                                        
                                    ],
                                    },
                                ],
                            }}
                        />
                    </ChartCard>

                </div>
        

            </section>            
        </main>
    );
}

function KpiCard({ title,value }) {
    return (
        <div className="rounded-xl bg-slate-900 p-6 shadow">
            <p className="text-sm text-slate-400">{title}</p>
            <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>
    );
}