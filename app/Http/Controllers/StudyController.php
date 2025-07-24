<?php

namespace App\Http\Controllers;

use App\Models\Study;
use App\Http\Requests\StoreStudyRequest;
use App\Http\Requests\UpdateStudyRequest;

class StudyController extends Controller
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
    public function store(StoreStudyRequest $request)
    {
        $study = Study::create($request->validated());

        $study->users()->attach(auth()->id(), ['role' => 'coordinator']);

        return response()->json($study, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Study $study)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Study $study)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudyRequest $request, Study $study)
    {
        $study->update($request->validated());

        // Update the pivot table if necessary
        if ($request->has('users')) {
            $study->users()->sync($request->input('users'));
        }

        return response()->json($study, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Study $study)
    {
        $study->delete();

        return response()->json(null, 204);
    }
}
