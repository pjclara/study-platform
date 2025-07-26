<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataEntry>
 */
class DataEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'study_entry_id' => \App\Models\StudyEntry::inRandomOrder()->first()->id,
            'variable_id' => \App\Models\Variable::inRandomOrder()->first()->id,
            'value' => $this->faker->randomElement(['Yes', 'No', 'Maybe']),
            'filled_by' => \App\Models\User::inRandomOrder()->first()->id,
            'filled_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'created_by' => \App\Models\User::inRandomOrder()->first()->id,
        ];
    }
}
