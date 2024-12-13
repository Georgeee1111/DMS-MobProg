<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;

class TenantController extends Controller
{
    public function index()
    {
        $tenants = Tenant::all();
        return response()->json($tenants, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email_address' => 'required|email|unique:tenants,email_address',
            'contact_number' => 'required|string|max:20',
            'room' => 'required|string|max:255',
        ]);

        $tenant = Tenant::create($validatedData);

        return response()->json($tenant, 201);
    }
}
