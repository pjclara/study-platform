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
            'participant_id' => \App\Models\Participant::factory(),
            'variable_id' => \App\Models\Variable::factory(),
            'value' => $this->faker->randomElement(['Yes', 'No', 'Maybe']),
            'filled_by' => \App\Models\User::factory(),
            'filled_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'created_by' => \App\Models\User::factory(),
            'updated_by' => \App\Models\User::factory(),
            'deleted_by' => null, // Assuming soft delete is not used
        ];
    }
}
