<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudyEntry>
 */
class StudyEntryFactory extends Factory
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
            'identifier' => $this->faker->unique()->word,
        ];
    }
}
