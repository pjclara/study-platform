<?php

namespace App\Http\Controllers;

use App\Models\DataEntry;
use App\Http\Requests\StoreDataEntryRequest;
use App\Http\Requests\UpdateDataEntryRequest;

class DataEntryController extends Controller
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
    public function store(StoreDataEntryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DataEntry $dataEntry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DataEntry $dataEntry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDataEntryRequest $request, DataEntry $dataEntry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DataEntry $dataEntry)
    {
        //
    }
}
