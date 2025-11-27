<?php

namespace App\Http\Controllers;

use App\Models\ProposalModel;
use App\Models\ProponentModel;
use App\Models\CollaboratorModel;
use App\Models\BeneficiaryModel;
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
     * Search existing proponents.
     */
    public function searchProponents(Request $request)
    {
        $search = $request->input('search', '');
        
        $proponents = ProponentModel::query();
        
        if ($search) {
            $proponents->where('proponent_name', 'LIKE', "%{$search}%");
        }
        
        $results = $proponents->select('proponent_id', 'proponent_name', 'sex')
            ->orderBy('proponent_name')
            ->limit(15)
            ->get();

        return response()->json($results);
    }

    /**
     * Search existing collaborators.
     */
    public function searchCollaborators(Request $request)
    {
        $search = $request->input('search', '');
        
        $collaborators = CollaboratorModel::query();
        
        if ($search) {
            $collaborators->where('collaborator_name', 'LIKE', "%{$search}%");
        }
        
        $results = $collaborators->select('collaborator_id', 'collaborator_name')
            ->orderBy('collaborator_name')
            ->limit(15)
            ->get();

        return response()->json($results);
    }

    /**
     * Search existing beneficiaries.
     */
    public function searchBeneficiaries(Request $request)
    {
        $search = $request->input('search', '');
        
        $beneficiaries = BeneficiaryModel::query();
        
        if ($search) {
            $beneficiaries->where('beneficiary', 'LIKE', "%{$search}%")
                          ->orWhere('beneficiary_leader', 'LIKE', "%{$search}%");
        }
        
        $results = $beneficiaries->select(
                'beneficiary_id',
                'beneficiary',
                'beneficiary_leader',
                'beneficiary_leader_sex',
                'male_beneficiaries',
                'female_beneficiaries',
                'total_beneficiaries'
            )
            ->orderBy('beneficiary')
            ->limit(15)
            ->get();

        return response()->json($results);
    }

    /**
     * Store a new proposal.
     */
    public function store(Request $request, $program_id)
    {
        $validated = Validator::make($request->all(), $this->getValidationRules())->validate();

        $proponent = $this->processProponent($validated);
        $collaborator = $this->processCollaborator($validated);
        $beneficiary = $this->processBeneficiary($validated);

        $proposal = ProposalModel::create([
            'user_id' => Auth::id(),
            'program_id' => $program_id,
            'proponent_id' => $proponent->proponent_id,
            'collaborator_id' => $collaborator?->collaborator_id,
            'beneficiary_id' => $beneficiary->beneficiary_id,
            'project_type' => $request->project_type ?? null,
            'title' => $validated['title'],
            'details' => $validated['details'],
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
        $proposal = ProposalModel::with(['user', 'program', 'proponent', 'collaborator', 'beneficiary'])->findOrFail($id);

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
        $query = ProposalModel::with(['program', 'user.office', 'proponent', 'collaborator', 'beneficiary']);

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
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('details', 'LIKE', "%{$search}%")
                  ->orWhere('status', 'LIKE', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('first_name', 'LIKE', "%{$search}%")
                                ->orWhere('last_name', 'LIKE', "%{$search}%");
                  })
                  ->orWhereHas('proponent', function ($q) use ($search) {
                      $q->where('proponent_name', 'LIKE', "%{$search}%");
                  })
                  ->orWhereHas('beneficiary', function ($q) use ($search) {
                      $q->where('beneficiary', 'LIKE', "%{$search}%");
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
        $proposal = ProposalModel::with(['user', 'program', 'proponent', 'collaborator', 'beneficiary'])->findOrFail($id);
        
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

        $validated = Validator::make($request->all(), $this->getValidationRules())->validate();

        $proponent = $this->processProponent($validated, true);
        $collaborator = $this->processCollaborator($validated, true);
        $beneficiary = $this->processBeneficiary($validated, true);

        $proposal->update([
            'title' => $validated['title'],
            'details' => $validated['details'],
            'project_type' => $request->project_type ?? $proposal->project_type,
            'proponent_id' => $proponent->proponent_id,
            'collaborator_id' => $collaborator?->collaborator_id,
            'beneficiary_id' => $beneficiary->beneficiary_id,
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

    /**
     * Validate and process proponent data
     */
    private function processProponent($validated, $isUpdate = false)
    {
        if ($validated['proponent_id']) {
            return ProponentModel::findOrFail($validated['proponent_id']);
        }
        
        // Always check if proponent exists by name and sex before creating
        $existing = ProponentModel::where('proponent_name', $validated['proponent_name'])
            ->where('sex', $validated['proponent_sex'])
            ->first();
        
        if ($existing) {
            return $existing;
        }
        
        // Create new if doesn't exist
        return ProponentModel::create([
            'proponent_name' => $validated['proponent_name'],
            'sex' => $validated['proponent_sex'],
        ]);
    }

    /**
     * Validate and process collaborator data
     */
    private function processCollaborator($validated, $isUpdate = false)
    {
        if ($validated['collaborator_id']) {
            return CollaboratorModel::findOrFail($validated['collaborator_id']);
        }
        
        if ($validated['collaborator_name']) {
            // Check if collaborator exists before creating
            $existing = CollaboratorModel::where('collaborator_name', $validated['collaborator_name'])
                ->first();
            
            if ($existing) {
                return $existing;
            }
            
            return CollaboratorModel::create([
                'collaborator_name' => $validated['collaborator_name']
            ]);
        }
        
        return null;
    }

    /**
     * Validate and process beneficiary data
     */
    private function processBeneficiary($validated, $isUpdate = false)
    {
        if ($validated['beneficiary_id']) {
            return BeneficiaryModel::findOrFail($validated['beneficiary_id']);
        }
        
        // Check if beneficiary exists by all relevant fields before creating
        $existing = BeneficiaryModel::where('beneficiary', $validated['beneficiary_name'])
            ->where('beneficiary_leader', $validated['beneficiary_leader'])
            ->where('beneficiary_leader_sex', $validated['beneficiary_leader_sex'])
            ->where('male_beneficiaries', $validated['male_beneficiaries'])
            ->where('female_beneficiaries', $validated['female_beneficiaries'])
            ->first();
        
        if ($existing) {
            return $existing;
        }
        
        $data = [
            'beneficiary_leader' => $validated['beneficiary_leader'],
            'beneficiary_leader_sex' => $validated['beneficiary_leader_sex'],
            'male_beneficiaries' => $validated['male_beneficiaries'],
            'female_beneficiaries' => $validated['female_beneficiaries'],
            'total_beneficiaries' => $validated['male_beneficiaries'] + $validated['female_beneficiaries'],
        ];
        
        return BeneficiaryModel::create([
            'beneficiary' => $validated['beneficiary_name'],
            ...$data
        ]);
    }

    /**
     * Common validation rules
     */
    private function getValidationRules()
    {
        return [
            'title' => 'required|string|max:255',
            'details' => 'required|string|max:5000',
            'project_type' => 'nullable|string|max:100',
            'proponent_name' => 'required|string|max:255',
            'proponent_sex' => 'required|string|in:Male,Female',
            'proponent_id' => 'nullable|exists:tbl_proponents,proponent_id',
            'collaborator_name' => 'nullable|string|max:255',
            'collaborator_id' => 'nullable|exists:tbl_collaborators,collaborator_id',
            'beneficiary_name' => 'required|string|max:255',
            'beneficiary_leader' => 'required|string|max:255',
            'beneficiary_leader_sex' => 'required|string|in:Male,Female',
            'beneficiary_id' => 'nullable|exists:tbl_beneficiaries,beneficiary_id',
            'male_beneficiaries' => 'required|integer|min:0',
            'female_beneficiaries' => 'required|integer|min:0',
        ];
    }
}