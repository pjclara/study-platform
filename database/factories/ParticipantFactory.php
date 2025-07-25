<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Participant>
 */
class ParticipantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'study_id' => \App\Models\Study::inRandomOrder()->first()->id,
            'code' => $this->faker->unique()->word,
            'imported_data' => null, // Assuming this is nullable
            'created_by' => \App\Models\User::inRandomOrder()->first()->id,
        ];
    }
}
