<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Study;
use App\Models\Participant;
use App\Models\Variable;
use App\Models\DataEnterie;
use App\Models\DataEntry;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();
        Study::factory(5)->create()->each(function ($study) {
            $study->users()->attach(User::inRandomOrder()->first(), ['role' => 'coordinator']);
        });
        Participant::factory(20)->create()->each(function ($participant) {
            $participant->study()->associate(Study::inRandomOrder()->first());
            $participant->save();
        });
        Variable::factory(10)->create()->each(function ($variable) {
            $variable->study()->associate(Study::inRandomOrder()->first());
            $variable->save();
        });

        DataEntry::factory(50)->create();

        
    }
}
