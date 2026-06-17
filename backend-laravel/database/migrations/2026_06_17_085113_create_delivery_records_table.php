<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('delivery_records', function (Blueprint $table) {
            $table->id();

            $table->string('delivery_id')->unique();
            $table->string('driver_id');

            $table->date('date');
            $table->string('priority');
            $table->string('vehicle_type');
            $table->float('delivery_distance');
            $table->float('idle');
            $table->float('arrival_est');
            $table->float('arrival_act');
            $table->float('attitude');
            $table->float('pkg_care');
            $table->float('responsiveness');
            $table->float('delivery_spd');
            $table->string('weather');
            $table->string('traffic_cond');
            $table->float('delay');
            $table->boolean('on_time');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_records');
    }
};
