<?php

namespace App\Http\Controllers;

use App\Models\Study;
use App\Models\Variable;
use App\Models\VariableOption;
use App\Http\Requests\StoreStudyRequest;
use App\Http\Requests\UpdateStudyRequest;
use App\Models\DataEntry;
use App\Models\StudyEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudyController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $studies = Study::select('id', 'name', 'start_date', 'end_date', 'status', 'study_type', 'description', 'ethical_approval')
            ->whereHas('users', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->get();
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
        // Add created_by and updated_by fields
        $validatedData = $request->validated();
        $validatedData['created_by'] = Auth::id();
        $study = Study::create($validatedData);

        $study->users()->attach(Auth::id(), ['role' => 'coordinator']);


        $studies = Study::select('id', 'name', 'start_date', 'end_date', 'status')->get();
        return inertia('studies/index', [
            'studies' => $studies
        ])->with('success', 'Study created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Study $study)
    {
        // se for para devolver json

        if (request()->wantsJson()) {
            return response()->json([
                'study' => $study,
                'variables' => $study->variables,
            ]);
        }

        $study->load('variables');
        return inertia('studies/show', [
            'study' => $study,
            'variables' => $study->variables,
            'users' => User::all(),
            'studyUser' => $study->users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->pivot->role,
                ];
            })->toArray(),
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
        if (request()->has('users')) {
            $study->users()->sync(request()->input('users'));
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:text,number,date,boolean,select',
            'options' => 'nullable|array',
            'options.*' => 'string',
        ]);
        $validated['created_by'] = Auth::id();
        $options = $validated['options'] ?? [];
        unset($validated['options']);
        $variable = $study->variables()->create($validated);
        if ($variable->type === 'select' && !empty($options)) {
            foreach ($options as $idx => $opt) {
                $variable->options()->create([
                    'value' => $opt,
                    'order_index' => $idx,
                ]);
            }
        }
        return redirect()->back()->with('success', 'Variable added successfully.');
    }

    /**
     * Update the specified variable for the study.
     */
    public function updateVariable(Request $request, Study $study, Variable $variable)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:text,number,date,boolean,select',
            'unit' => 'nullable|string|max:50',
            'group' => 'nullable|string|max:50',
            'order_index' => 'nullable|integer',
            'required' => 'boolean',
            'options' => 'nullable|array',
            'options.*' => 'string',
        ]);
        $options = $validated['options'] ?? [];
        unset($validated['options']);
        $variable->update($validated);
        if ($variable->type === 'select') {
            // Remove opções antigas
            $variable->options()->delete();
            // Adiciona novas opções
            foreach ($options as $idx => $opt) {
                $variable->options()->create([
                    'value' => $opt,
                    'order_index' => $idx,
                ]);
            }
        }
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

    /**
     * Display the data list for the specified study.
     */

    public function dataList($studyId)
    {
        $study = Study::with('variables')->findOrFail($studyId);

        // Todas as variáveis do estudo
        $variables = Variable::where('study_id', $studyId)
            ->with(['options' => function ($q) {
                $q->orderBy('order_index');
            }])
            ->select('id', 'name', 'type', 'order_index')
            ->get()
            ->sortBy('order_index');


        // Todas as entradas de dados do estudo
        $entries = StudyEntry::with(['dataEntries.variable'])
            ->where('study_id', $study->id)
            ->get()
            ->map(function ($entry) use ($variables) {
                // Inicializa o array com os IDs das variáveis
                $values = [];

                foreach ($variables as $var) {
                    $values[$var->id] = '';
                }

                foreach ($entry->dataEntries as $dataEntry) {
                    $values[$dataEntry->variable_id] = $dataEntry->value;
                }

                return [
                    'id' => $entry->id,
                    'values' => $values,
                    'created_at' => $entry->created_at,
                ];
            });


        return inertia('studies/data-list', [
            'studyId' => $studyId,
            'variables' => $variables->map(function ($v) {
                return [
                    'id' => $v->id,
                    'name' => $v->name,
                    'type' => $v->type,
                    'order_index' => $v->order_index,
                    'options' => ($v->type === 'select' && is_object($v->options)) ? $v->options->pluck('value')->toArray() : [],
                ];
            })->values(),
            'studyEntries' => $entries,
        ]);
    }

    //deleteEntry 
    public function deleteEntry($studyId, $entryId)
    {
        $entry = StudyEntry::findOrFail($entryId);
        $entry->dataEntries()->delete(); // Exclui todas as entradas de dados associadas
        $entry->delete(); // Exclui a entrada de estudo

        return redirect()->route('studies.data-list', $studyId)->with('success', 'Entrada excluída com sucesso.');
    }



    public function editEntry($studyId, $entryId)
    {
        $study = Study::with('variables')->findOrFail($studyId);

        $studyEntry = StudyEntry::with(['dataEntries'])->findOrFail($entryId);

        // Monta objeto de valores para todas variáveis
        $values = [];
        foreach ($study->variables as $variable) {
            $values[$variable->id] = '';
        }
        foreach ($studyEntry->dataEntries as $dataEntry) {
            $values[$dataEntry->variable_id] = $dataEntry->value;
        }

        return inertia('studies/edit-data-entry', [
            'studyId' => $studyId,
            'entry' => [
                'id' => $studyEntry->id,
                'values' => $values,
                'created_at' => $studyEntry->created_at,
            ],
            'variables' => $study->variables->map(function ($v) {
                return [
                    'id' => $v->id,
                    'name' => $v->name,
                    'type' => $v->type,
                    'order_index' => $v->order_index,
                    'options' => ($v->type === 'select' && is_object($v->options)) ? $v->options->pluck('value')->toArray() : [],
                ];
            }),
        ]);
    }

    public function updateEntry(Request $request, $studyId, $entryId)
    {
        $entry = StudyEntry::with(['dataEntries'])->findOrFail($entryId);


        $values = $request->input('values', []);
        foreach ($values as $variableId => $value) {
            DataEntry::updateOrCreate(
                [
                    'study_entry_id' => $entry->id,
                    'variable_id' => $variableId,
                ],
                [
                    'value' => $value,
                    'filled_by' => Auth::id(),
                    'filled_at' => now(),
                    'created_by' => Auth::id(),
                ]
            );
        }

        return redirect()->route('studies.data-list', $studyId)->with('success', 'Entrada atualizada!');
    }
    /**
     * Display the data entry form for the specified study.
     */
    public function dataEntryForm(Study $study)
    {

        $variables = $study->variables()->with(['options' => function ($q) {
            $q->orderBy('order_index');
        }])->select('id', 'name', 'type', 'order_index')->get();
        return inertia('studies/data-entry-form', [
            'studyId' => $study->id,
            'variables' => $variables->map(function ($v) {
                return [
                    'id' => $v->id,
                    'name' => $v->name,
                    'type' => $v->type,
                    'order_index' => $v->order_index,
                    'options' => ($v->type === 'select' && is_object($v->options)) ? $v->options->pluck('value')->toArray() : [],
                ];
            }),
        ]);
    }

    /**
     * Store a newly created data entry for the specified study.
     */
    public function storeDataEntry(Request $request, Study $study)
    {
        // criar um study entery automatico
        $studyEntry = $study->studyEntries()->create([
            'identifier' => 'entry-' . now()->timestamp
        ]);

        $validated = $request->validate([
            'values' => 'required|array',
            'values.*' => 'required|string',
        ]);
        $filledBy = Auth::id();
        $filledAt = now();
        foreach ($validated['values'] as $variableId => $value) {
            $study->dataEntries()->create([
                'study_entry_id' => $studyEntry->id,
                'variable_id' => $variableId,
                'value' => $value,
                'filled_by' => $filledBy,
                'filled_at' => $filledAt,
                'created_by' => Auth::id()

            ]);
        }
        return redirect()->route('studies.data-list', $study->id)->with('success', 'Data entries added successfully.');
    }

    public function addUser(Request $request, Study $study)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:admin,coordinator,viewer',
        ]);

        $study->users()->attach($validated['user_id'], ['role' => $validated['role']]);

        return back(); // Inertia lida bem com isso
    }

    public function updateUserRole(Request $request, Study $study, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,coordinator,viewer',
        ]);

        $study->users()->updateExistingPivot($user->id, ['role' => $validated['role']]);
        return back(); // Inertia lida bem com isso
    }
    public function removeUser(Study $study, User $user)
    {
        $study->users()->detach($user->id);
        return back(); // Inertia lida bem com isso
    }

    /**
     * Atualiza a ordem das variáveis do estudo.
     */
    public function orderVariables(Request $request, Study $study)
    {
        $order = $request->input('order', []);
        foreach ($order as $item) {
            if (isset($item['id'], $item['order_index'])) {
                Variable::where('id', $item['id'])->where('study_id', $study->id)->update(['order_index' => $item['order_index']]);
            }
        }
        return response()->json(['success' => true]);
    }

    /**
     * Show the form for editing a variable.
     */
    public function editVariable(Study $study, Variable $variable)
    {
        $variable->load(['options' => function ($q) {
            $q->orderBy('order_index');
        }]);
        return inertia('studies/edit-variable', [
            'studyId' => $study->id,
            'variable' => [
                'id' => $variable->id,
                'name' => $variable->name,
                'type' => $variable->type,
                'order_index' => $variable->order_index,
                'options' => ($variable->type === 'select' && is_object($variable->options)) ? $variable->options->pluck('value')->toArray() : [],
            ],
        ]);
    }
}
