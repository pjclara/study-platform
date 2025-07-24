<?php

namespace App\Http\Controllers;

use App\Models\Variable;
use App\Http\Requests\StoreVariableRequest;
use App\Http\Requests\UpdateVariableRequest;

class VariableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVariableRequest $request)
    {
        // Validate and store the variable using the StoreVariableRequest
        $validatedData = $request->validated();
        Variable::create($validatedData);

        // Optionally, return a response or redirect
        return response()->json(['message' => 'Variable created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Variable $variable)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Variable $variable)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVariableRequest $request, Variable $variable)
    {
        // Validate and update the variable using the UpdateVariableRequest
        $validatedData = $request->validated();
        $variable->update($validatedData);

        // Optionally, return a response or redirect
        return response()->json(['message' => 'Variable updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Variable $variable)
    {
        // Delete the variable
        $variable->delete();

        // Optionally, return a response or redirect
        return response()->json(['message' => 'Variable deleted successfully'], 200);
    }
}
