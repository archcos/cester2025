import { useState, useRef } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { ChevronLeft, Info, Save, X, FileText, Tag, AlertCircle, Trash2, Users, UserCheck, Search } from "lucide-react";

// Program definitions
const programs = {
  1: { name: "CEST" },
  2: { name: "LGIA" },
  3: { name: "SSCP" },
};

// CEST subtypes
const cestTypes = [
  {
    id: "external",
    label: "External Projects and is Non-R&D",
  },
  {
    id: "internal",
    label: "Internal Projects with external implementing agency and is Non-R&D",
  },
];

// LGIA subtypes
const lgiaTypes = [
  {
    id: "rnd",
    label: "Research and Development",
  },
  {
    id: "external",
    label: "External Projects and is Non-R&D",
  },
  {
    id: "internal",
    label: "Internal Projects with DOST implementers and is Non-R&D",
  },
];

export default function Edit({ proposal }) {
  const program = programs[proposal.program_id] || { name: "Unknown Program" };
  const [hasChanges, setHasChanges] = useState(false);

  // Search states
  const [proponentSearch, setProponentSearch] = useState("");
  const [proponentResults, setProponentResults] = useState([]);
  const [proponentOpen, setProponentOpen] = useState(false);
  const proponentRef = useRef(null);

  const [collaboratorSearch, setCollaboratorSearch] = useState("");
  const [collaboratorResults, setCollaboratorResults] = useState([]);
  const [collaboratorOpen, setCollaboratorOpen] = useState(false);
  const collaboratorRef = useRef(null);

  const [beneficiarySearch, setBeneficiarySearch] = useState("");
  const [beneficiaryResults, setBeneficiaryResults] = useState([]);
  const [beneficiaryOpen, setBeneficiaryOpen] = useState(false);
  const beneficiaryRef = useRef(null);

  const { data, setData, put, processing, errors } = useForm({
    title: proposal.title || "",
    details: proposal.details || "",
    project_type: proposal.project_type || "",
    proponent_id: proposal.proponent?.proponent_id || null,
    proponent_name: proposal.proponent?.proponent_name || "",
    proponent_sex: proposal.proponent?.sex || "",
    collaborator_id: proposal.collaborator?.collaborator_id || null,
    collaborator_name: proposal.collaborator?.collaborator_name || "",
    beneficiary_id: proposal.beneficiary?.beneficiary_id || null,
    beneficiary_name: proposal.beneficiary?.beneficiary || "",
    beneficiary_leader: proposal.beneficiary?.beneficiary_leader || "",
    beneficiary_leader_sex: proposal.beneficiary?.beneficiary_leader_sex || "",
    male_beneficiaries: proposal.beneficiary?.male_beneficiaries || 0,
    female_beneficiaries: proposal.beneficiary?.female_beneficiaries || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('proposals.update', proposal.proposal_id), {
      onSuccess: () => {
        setHasChanges(false);
      }
    });
  };

  const handleChange = (field, value) => {
    setData(field, value);
    setHasChanges(true);
    
    // When proponent name or sex changes, clear proponent_id to create a new one
    if ((field === 'proponent_name' || field === 'proponent_sex') && data.proponent_id) {
      setData('proponent_id', null);
    }
    
    // When collaborator name changes, clear collaborator_id to create a new one
    if (field === 'collaborator_name' && data.collaborator_id) {
      setData('collaborator_id', null);
    }
    
    // When beneficiary name or leader changes, clear beneficiary_id to create a new one
    if ((field === 'beneficiary_name' || field === 'beneficiary_leader' || field === 'beneficiary_leader_sex') && data.beneficiary_id) {
      setData('beneficiary_id', null);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this proposal? This action cannot be undone.')) {
      router.delete(route('proposals.destroy', proposal.proposal_id), {
        onSuccess: () => {
          // Will redirect to proposals list after deletion
        }
      });
    }
  };

  // Get available types based on program
  const getProjectTypes = () => {
    if (proposal.program_id === 1) return cestTypes;
    if (proposal.program_id === 2) return lgiaTypes;
    return [];
  };

  const projectTypes = getProjectTypes();
  const showTypeSelector = projectTypes.length > 0;
  const isEditable = proposal.status === 'Pending';

  // Search proponents
  const searchProponents = async (query) => {
    if (query.trim().length < 1) {
      setProponentResults([]);
      return;
    }
    try {
      const response = await fetch(`/proposals/search-proponents?search=${encodeURIComponent(query)}`);
      const results = await response.json();
      setProponentResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setProponentResults([]);
    }
  };

  // Handle proponent selection
  const selectProponent = (proponent) => {
    setData({
      ...data,
      proponent_id: proponent.proponent_id,
      proponent_name: proponent.proponent_name,
      proponent_sex: proponent.sex,
    });
    setProponentSearch("");
    setProponentResults([]);
    setProponentOpen(false);
    setHasChanges(true);
  };

  // Search collaborators
  const searchCollaborators = async (query) => {
    if (query.trim().length < 1) {
      setCollaboratorResults([]);
      return;
    }
    try {
      const response = await fetch(`/proposals/search-collaborators?search=${encodeURIComponent(query)}`);
      const results = await response.json();
      setCollaboratorResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setCollaboratorResults([]);
    }
  };

  // Handle collaborator selection
  const selectCollaborator = (collaborator) => {
    setData({
      ...data,
      collaborator_id: collaborator.collaborator_id,
      collaborator_name: collaborator.collaborator_name,
    });
    setCollaboratorSearch("");
    setCollaboratorResults([]);
    setCollaboratorOpen(false);
    setHasChanges(true);
  };

  // Search beneficiaries
  const searchBeneficiaries = async (query) => {
    if (query.trim().length < 1) {
      setBeneficiaryResults([]);
      return;
    }
    try {
      const response = await fetch(`/proposals/search-beneficiaries?search=${encodeURIComponent(query)}`);
      const results = await response.json();
      setBeneficiaryResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setBeneficiaryResults([]);
    }
  };

  // Handle beneficiary selection
  const selectBeneficiary = (beneficiary) => {
    setData({
      ...data,
      beneficiary_id: beneficiary.beneficiary_id,
      beneficiary_name: beneficiary.beneficiary,
      beneficiary_leader: beneficiary.beneficiary_leader,
      beneficiary_leader_sex: beneficiary.beneficiary_leader_sex,
      male_beneficiaries: beneficiary.male_beneficiaries,
      female_beneficiaries: beneficiary.female_beneficiaries,
    });
    setBeneficiarySearch("");
    setBeneficiaryResults([]);
    setBeneficiaryOpen(false);
    setHasChanges(true);
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gray-50 min-h-screen">
      <Head title={`Edit Proposal: ${proposal.title}`} />

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/proposals/${proposal.proposal_id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 hover:gap-3 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Proposal
        </Link>

        {/* Warning Banner if not pending */}
        {!isEditable && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Proposal is Not Editable</h3>
                <p className="text-sm text-amber-800">
                  This proposal has a status of <span className="font-semibold">"{proposal.status}"</span> and cannot be edited. Only pending proposals can be modified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Edit Proposal</h1>
                  <div className="flex items-center gap-2 text-blue-100 mt-1">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm">{program.name} Program</span>
                  </div>
                </div>
              </div>
              
              {/* Delete Button */}
              {isEditable && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              )}
            </div>

            {/* Unsaved Changes Indicator */}
            {hasChanges && (
              <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 border border-white/25">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
            )}
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Proposal ID Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <div className="text-sm text-blue-900">
                    Proposal ID: <span className="font-mono font-semibold">#{proposal.proposal_id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide font-semibold px-3 py-1 rounded-full" 
                    style={{
                      backgroundColor: proposal.status === 'Pending' ? '#dbeafe' : proposal.status === 'Approved' ? '#dcfce7' : '#fee2e2',
                      color: proposal.status === 'Pending' ? '#1e40af' : proposal.status === 'Approved' ? '#166534' : '#991b1b'
                    }}>
                    {proposal.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Type Selector (for CEST and LGIA) */}
            {showTypeSelector && (
              <div>
                <label className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Project Type
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.project_type}
                  onChange={(e) => handleChange("project_type", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  required
                  disabled={!isEditable}
                >
                  <option value="">Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.project_type && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.project_type}
                  </p>
                )}
              </div>
            )}

            {/* Project Title */}
            <div>
              <label className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Project Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder="Enter a descriptive title for your proposal"
                required
                disabled={!isEditable}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.title && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {data.title.length} / 255
                </span>
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Proposal Details
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={data.details}
                onChange={(e) => handleChange("details", e.target.value)}
                rows="8"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder="Provide detailed information about your proposal..."
                required
                disabled={!isEditable}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.details && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.details}
                  </p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {data.details.length} / 5000
                </span>
              </div>
            </div>

            {/* Proponent Section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Proponent Information
              </h3>
              
              {/* Search/Select Proponent */}
              <div className="mb-4 relative" ref={proponentRef}>
                <label className="block font-medium text-gray-700 mb-2">
                  Search Existing Proponent (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={proponentSearch}
                    onChange={(e) => {
                      setProponentSearch(e.target.value);
                      searchProponents(e.target.value);
                    }}
                    onFocus={() => {
                      setProponentOpen(true);
                      if (proponentSearch.trim()) searchProponents(proponentSearch);
                    }}
                    disabled={!isEditable}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Dropdown Results */}
                {proponentOpen && proponentResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {proponentResults.map((proponent) => (
                      <button
                        key={proponent.proponent_id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectProponent(proponent);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{proponent.proponent_name}</div>
                        <div className="text-xs text-gray-500">{proponent.sex}</div>
                      </button>
                    ))}
                  </div>
                )}
                {proponentOpen && proponentSearch && proponentResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </div>

              {/* Manual Entry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Proponent Name *
                  </label>
                  <input
                    type="text"
                    value={data.proponent_name}
                    onChange={(e) => handleChange("proponent_name", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    required
                    disabled={!isEditable}
                  />
                  {errors.proponent_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.proponent_name}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Sex *
                  </label>
                  <select
                    value={data.proponent_sex}
                    onChange={(e) => handleChange("proponent_sex", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    required
                    disabled={!isEditable}
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.proponent_sex && (
                    <p className="text-red-600 text-sm mt-1">{errors.proponent_sex}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Collaborator Section */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Collaborator Information
              </h3>
              
              {/* Search/Select Collaborator */}
              <div className="mb-4 relative" ref={collaboratorRef}>
                <label className="block font-medium text-gray-700 mb-2">
                  Search Existing Collaborator (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={collaboratorSearch}
                    onChange={(e) => {
                      setCollaboratorSearch(e.target.value);
                      searchCollaborators(e.target.value);
                    }}
                    onFocus={() => {
                      setCollaboratorOpen(true);
                      if (collaboratorSearch.trim()) searchCollaborators(collaboratorSearch);
                    }}
                    disabled={!isEditable}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Dropdown Results */}
                {collaboratorOpen && collaboratorResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {collaboratorResults.map((collaborator) => (
                      <button
                        key={collaborator.collaborator_id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectCollaborator(collaborator);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{collaborator.collaborator_name}</div>
                      </button>
                    ))}
                  </div>
                )}
                {collaboratorOpen && collaboratorSearch && collaboratorResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </div>

              {/* Manual Entry */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Collaborator Name (Optional)
                </label>
                <input
                  type="text"
                  value={data.collaborator_name}
                  onChange={(e) => handleChange("collaborator_name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  disabled={!isEditable}
                />
                {errors.collaborator_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.collaborator_name}</p>
                )}
              </div>
            </div>

            {/* Beneficiary Section */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                Beneficiary Information
              </h3>
              
              {/* Search/Select Beneficiary */}
              <div className="mb-4 relative" ref={beneficiaryRef}>
                <label className="block font-medium text-gray-700 mb-2">
                  Search Existing Beneficiary (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={beneficiarySearch}
                    onChange={(e) => {
                      setBeneficiarySearch(e.target.value);
                      searchBeneficiaries(e.target.value);
                    }}
                    onFocus={() => {
                      setBeneficiaryOpen(true);
                      if (beneficiarySearch.trim()) searchBeneficiaries(beneficiarySearch);
                    }}
                    disabled={!isEditable}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                
                {/* Dropdown Results */}
                {beneficiaryOpen && beneficiaryResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {beneficiaryResults.map((beneficiary) => (
                      <button
                        key={beneficiary.beneficiary_id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectBeneficiary(beneficiary);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{beneficiary.beneficiary}</div>
                        <div className="text-xs text-gray-500">Leader: {beneficiary.beneficiary_leader} ({beneficiary.beneficiary_leader_sex})</div>
                        <div className="text-xs text-gray-500">Total: {beneficiary.total_beneficiaries} ({beneficiary.male_beneficiaries}M, {beneficiary.female_beneficiaries}F)</div>
                      </button>
                    ))}
                  </div>
                )}
                {beneficiaryOpen && beneficiarySearch && beneficiaryResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </div>
              
              {/* Manual Entry */}
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    value={data.beneficiary_name}
                    onChange={(e) => handleChange("beneficiary_name", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    required
                    disabled={!isEditable}
                  />
                  {errors.beneficiary_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.beneficiary_name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Beneficiary Leader *
                    </label>
                    <input
                      type="text"
                      value={data.beneficiary_leader}
                      onChange={(e) => handleChange("beneficiary_leader", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      required
                      disabled={!isEditable}
                    />
                    {errors.beneficiary_leader && (
                      <p className="text-red-600 text-sm mt-1">{errors.beneficiary_leader}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Leader Sex *
                    </label>
                    <select
                      value={data.beneficiary_leader_sex}
                      onChange={(e) => handleChange("beneficiary_leader_sex", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      required
                      disabled={!isEditable}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.beneficiary_leader_sex && (
                      <p className="text-red-600 text-sm mt-1">{errors.beneficiary_leader_sex}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Male Beneficiaries *
                    </label>
                    <input
                      type="number"
                      value={data.male_beneficiaries}
                      onChange={(e) => handleChange("male_beneficiaries", parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      required
                      disabled={!isEditable}
                    />
                    {errors.male_beneficiaries && (
                      <p className="text-red-600 text-sm mt-1">{errors.male_beneficiaries}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">
                      Female Beneficiaries *
                    </label>
                    <input
                      type="number"
                      value={data.female_beneficiaries}
                      onChange={(e) => handleChange("female_beneficiaries", parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      required
                      disabled={!isEditable}
                    />
                    {errors.female_beneficiaries && (
                      <p className="text-red-600 text-sm mt-1">{errors.female_beneficiaries}</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                  <p className="text-sm font-medium text-gray-700">
                    Total Beneficiaries: <span className="font-bold text-green-600 text-lg">{data.male_beneficiaries + data.female_beneficiaries}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href={`/proposals/${proposal.proposal_id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>

              {isEditable && (
                <button
                  onClick={handleSubmit}
                  disabled={processing || !hasChanges}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Save className="w-4 h-4" />
                  {processing ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}