<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Study;
use App\Models\Participant;
use App\Models\Variable;
use App\Models\DataEnterie;
use App\Models\DataEntry;
use App\Models\StudyEntry;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
        ]);
        /*
        Study::factory(1)->create()->each(function ($study) {
            $study->users()->attach(User::inRandomOrder()->first(), ['role' => 'coordinator']);
        });
        StudyEntry::factory(1)->create()->each(function ($studyEntry) {
            $studyEntry->study()->associate(Study::inRandomOrder()->first());
            $studyEntry->save();
        });
        Variable::factory(1)->create();
        DataEntry::factory(1)->create();
        Participant::factory(1)->create();
        */

        
    }
}
