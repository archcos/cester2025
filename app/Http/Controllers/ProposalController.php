<?php

namespace App\Http\Controllers;

use App\Models\ProposalModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProposalController extends Controller
{
    /**
     * Show the create page for a program.
     */
    public function create($program_id)
    {
        return Inertia::render('Proposals/Create', [
            'program_id' => (int) $program_id,
        ]);
    }

    /**
     * Store a new proposal.
     */
    public function store(Request $request, $program_id)
    {
        $validated = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'details' => 'required|string|max:5000',
            'project_type' => 'nullable|string|max:100', // only for LGIA
        ])->validate();

        $proposal = ProposalModel::create([
            'user_id' => Auth::id(),
            'program_id' => $program_id,
            'project_type' => $request->project_type ?? null,
            'title' => $request->title,
            'details' => $request->details,
            'status' => 'Pending',
        ]);

        return redirect()
            ->route('proposals.show', $proposal->proposal_id)
            ->with('success', 'Proposal submitted successfully.');
    }

    /**
     * Display a single proposal.
     */
    public function show($id)
    {
        $proposal = ProposalModel::with(['user', 'program'])->findOrFail($id);

        return Inertia::render('Proposals/Show', [
            'proposal' => $proposal,
        ]);
    }

    /**
     * List all proposals based on user role
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user->role;
        
        // Get search filter
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);

        // Build query based on role
        $query = ProposalModel::with(['program', 'user.office']);

        if ($role === 'user') {
            // Users see only their own proposals
            $query->where('user_id', $user->user_id);
        } elseif ($role === 'psto') {
            // PSTO sees proposals from users in their office
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('office_id', $user->office_id);
            });
        } elseif (in_array($role, ['head', 'rpmo', 'staff'])) {
            // Head, RPMO, and Staff see all proposals
            // No additional filter needed
        } else {
            // Default: no proposals visible
            $query->whereRaw('1 = 0');
        }

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('details', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        // Order by latest and paginate
        $proposals = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Proposals/Index', [
            'proposals' => $proposals,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
            ],
        ]);
    }
  /**
     * Show the edit form for a proposal.
     */
    public function edit($id)
    {
        $proposal = ProposalModel::with(['user', 'program'])->findOrFail($id);
        
        // Check if user is authorized to edit
        $user = Auth::user();
        if ($proposal->user_id !== $user->user_id) {
            return redirect()
                ->route('proposals.show', $id)
                ->with('error', 'You are not authorized to edit this proposal.');
        }

        return Inertia::render('Proposals/Edit', [
            'proposal' => $proposal,
        ]);
    }

    /**
     * Update a proposal.
     */
    public function update(Request $request, $id)
    {
        $proposal = ProposalModel::findOrFail($id);
        
        // Check if user is authorized to update
        $user = Auth::user();
        if ($proposal->user_id !== $user->user_id) {
            return redirect()
                ->route('proposals.show', $id)
                ->with('error', 'You are not authorized to update this proposal.');
        }

        // Check if proposal is still pending
        if ($proposal->status !== 'Pending') {
            return redirect()
                ->route('proposals.show', $id)
                ->with('error', 'Only pending proposals can be edited.');
        }

        $validated = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'details' => 'required|string|max:5000',
            'project_type' => 'nullable|string|max:100',
        ])->validate();

        $proposal->update([
            'title' => $request->title,
            'details' => $request->details,
            'project_type' => $request->project_type ?? $proposal->project_type,
        ]);

        return redirect()
            ->route('proposals.show', $proposal->proposal_id)
            ->with('success', 'Proposal updated successfully.');
    }

    /**
     * Delete a proposal.
     */
    public function destroy($id)
    {
        $proposal = ProposalModel::findOrFail($id);
        
        // Check if user is authorized to delete
        $user = Auth::user();
        if ($proposal->user_id !== $user->user_id) {
            return redirect()
                ->route('proposals.show', $id)
                ->with('error', 'You are not authorized to delete this proposal.');
        }

        // Check if proposal is still pending
        if ($proposal->status !== 'Pending') {
            return redirect()
                ->route('proposals.show', $id)
                ->with('error', 'Only pending proposals can be deleted.');
        }

        $proposal->delete();

        return redirect()
            ->route('proposals.index')
            ->with('success', 'Proposal deleted successfully.');
    }
}