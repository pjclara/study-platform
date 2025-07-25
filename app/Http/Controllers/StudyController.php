<?php

namespace App\Http\Controllers;

use App\Models\Study;
use App\Models\Variable;
use App\Http\Requests\StoreStudyRequest;
use App\Http\Requests\UpdateStudyRequest;
use Illuminate\Http\Request;

class StudyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $studies = Study::select('id', 'name', 'start_date', 'end_date', 'status')->get();
        return inertia('studies/index', [
            'studies' => $studies
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('studies/create');
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
        $study->load('variables');
        return inertia('studies/show', [
            'study' => $study,
            'variables' => $study->variables,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Study $study)
    {
        return inertia('studies/edit', [
            'study' => $study
        ]);
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

        return redirect()->route('studies.index')->with('success', 'Study updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Study $study)
    {
        $study->delete();

        return redirect()->route('studies.index')->with('success', 'Study deleted successfully.');
    }

    /**
     * Store a newly created variable for the specified study.
     */
    public function storeVariable(Request $request, Study $study)
    {
        // created_by 
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:string,integer,float,boolean',
        ]);
        // add created_by 
        $validated['created_by'] = auth()->id();
        $variable = $study->variables()->create($validated);
        return redirect()->back()->with('success', 'Variable added successfully.');
    }

    /**
     * Update the specified variable for the study.
     */
    public function updateVariable(Request $request, Study $study, Variable $variable)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:string,integer,float,boolean',
        ]);
        $variable->update($validated);
        return redirect()->back()->with('success', 'Variable updated successfully.');
    }

    /**
     * Remove the specified variable from the study.
     */
    public function deleteVariable(Study $study, Variable $variable)
    {
        $variable->delete();
        return redirect()->back()->with('success', 'Variable deleted successfully.');
    }
}
