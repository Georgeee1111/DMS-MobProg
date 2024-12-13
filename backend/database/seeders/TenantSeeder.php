<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Tenant::create(['name' => 'John Doe', 'room' => '101']);
        Tenant::create(['name' => 'Jane Smith', 'room' => '102']);
        Tenant::create(['name' => 'Mike Johnson', 'room' => '103']);
    }
}
