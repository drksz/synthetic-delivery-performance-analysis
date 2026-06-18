<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeliveryAnalyticsController extends Controller
{
    public function kpis() {
        
        $result = DB::select("
            SELECT 
                COUNT(*) AS total_deliveries,
                ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY delay)::numeric,3) AS median_delay_mins,

                ROUND(
                    (SUM(CASE WHEN on_time = true THEN 1 ELSE 0 END) * 100.0)
                    / COUNT(*)::numeric, 2
                ) AS on_time_percentage
    
            FROM delivery_records; 
        ");

        return response()->json($result);
    }

    public function weatherStats() {

        $result = DB::select("
            SELECT
                weather,
                ROUND(
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY delay)::numeric, 2
                ) AS median_delay_mins,
    
                ROUND(
                    AVG(est_veh_spd)::numeric, 2
                ) AS est_vehicle_speed_kmh
    
            FROM delivery_records
            GROUP BY weather;
        ");

        return response()->json($result);
    }

    public function vehicleStats() {

        $result = DB::select("
            WITH row_count AS (
                SELECT COUNT(*) AS total_rows
                FROM delivery_records
            )

            SELECT 
                dr.vehicle_type,
                COUNT(*) AS \"count\",
                ROUND(100.0 * COUNT(*) / rc.total_rows::numeric, 2) AS proportion

            FROM delivery_records AS dr
            CROSS JOIN row_count AS rc
            GROUP BY dr.vehicle_type, rc.total_rows
            ORDER BY proportion DESC;
        
        ");

        return response()->json($result);
    }

    public function priorityStats() {

        $result = DB::select("
            WITH row_count AS (
                SELECT COUNT(*) AS total_rows
                FROM delivery_records
            )

            SELECT
                dr.priority,
                ROUND(100.0 * COUNT(*) / rc.total_rows::numeric, 2) AS proportion,
                COUNT(*) FILTER(WHERE on_time = true) AS on_time_count,
                COUNT(*) FILTER(WHERE on_time = false) AS late_count,

                ROUND(
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dr.delay)::numeric, 2
                ) AS median_delay_mins

            FROM delivery_records AS dr
            CROSS JOIN row_count AS rc
            GROUP BY dr.priority, rc.total_rows;
        ");

        return response()->json($result);
    }

    public function weekdayDelay() {

        $result = DB::select("
            SELECT 
              dr.weekday,
            ROUND(  
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dr.delay)::numeric, 2
            )AS median_delay_mins

            FROM delivery_records AS dr
            GROUP BY dr.weekday 
            ORDER BY (
                CASE dr.weekday
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                    ELSE 0 END
                );
        ");

        return response()->json($result);
    }

    public function weekTotalDelay() {
    

    $result = DB::select("
        SELECT
        DATE_TRUNC('week', date) AS week_start,
        ROUND(SUM(delay)::numeric, 2) AS total_delay_mins

        FROM delivery_records
        GROUP BY week_start 
        ORDER BY week_start;
    ");

    return response()->json($result);
}

    public function monthTotalDelay() {

        $result = DB::select("
            SELECT
            DATE_TRUNC('month', date) AS month_start,
            ROUND(SUM(delay)::numeric, 2) AS total_delay_mins

            FROM delivery_records
            GROUP BY month_start 
            ORDER BY month_start;
        ");

        return response()->json($result);
    }

    public function ratingSummary() {

        $result = DB::select("
            SELECT
                r.rating_name,
                ROUND(AVG(r.vals)::numeric, 2) AS average
            FROM delivery_records, 
            LATERAL (
                VALUES
                    ('Attitude', attitude),
                    ('Package Care', pkg_care),
                    ('Responsiveness', responsiveness),
                    ('Delivery Speed', delivery_spd)
                    ) AS r(rating_name, vals)
            GROUP BY r.rating_name;
        ");

        return response()->json($result);
    }
}



