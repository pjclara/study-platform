<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Variable>
 */
class VariableFactory extends Factory
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
            'name' => $this->faker->word,
            'type' => $this->faker->randomElement(['string', 'integer', 'float', 'boolean']),
            'created_by' => \App\Models\User::inRandomOrder()->first()->id,
        ];
    }
}
