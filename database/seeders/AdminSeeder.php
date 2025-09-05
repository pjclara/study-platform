<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Cria o papel admin
        $role = Role::firstOrCreate(['name' => 'admin']);

        // Cria permissões básicas
        $permissions = [
            'manage studies',
            'manage users',
            'manage variables',
            'manage data',
        ];
        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }
        $role->syncPermissions($permissions);

        // Cria usuário admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
            ]
        );
        $admin->assignRole($role);
    }
}
