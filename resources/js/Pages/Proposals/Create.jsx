import { useState, useRef, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ChevronLeft, Info, Search, X } from "lucide-react";

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
    requirements: [
      "Complete Proposal following the DOST Format:",
      "a. DOST Form 3 - Project Proposal",
      "b. DOST Form 4 - Line-/item-Budget",
      "c. DOST Form 5A and 5B - Workplan, and Expected Outputs",
      "d. DOST Form 5C - Risk and Assumptions (if applicable)",
    ],
    attachments: [
      "Letter of Intent (For external proponent)",
      "Endorsement of the Project by the Head of Office (SUC President or Mayor)",
      "Profile/School Profile (Attach or incorporate - For external beneficiaries)",
      "Quotation of Equipment (if LIB has equipment outlay)",
      "SEC Registration (For External Proponent or Beneficiary)",
      "Special Order for the designation of the Project Leader by the Head of Office (For external proponent)",
      "Curriculum Vitae of Project Leader or Head of Beneficiary Group (For external projects)",
      "Board Resolution (For external proponent)",
      "Review and Evaluation Form (For proposals facilitated by DOST-provincial office)",
      "PSTD Endorsement Letter (For proposals facilitated by DOST-provincial office)",
    ],
    approvalDocs: [
      "Approval Letter or Disapproval",
      "Memorandum of Agreement",
      "Letter of Funds Released",
    ],
  },
  {
    id: "internal",
    label: "Internal Projects with external implementing agency and is Non-R&D",
    requirements: [
      "Complete Proposal following the DOST Format:",
      "a. DOST Form 3 - Project Proposal",
      "b. DOST Form 4 - Line-/item-Budget",
      "c. DOST Form 5A and 5B - Workplan, and Expected Outputs",
      "d. DOST Form 5C - Risk and Assumptions (if applicable)",
    ],
    attachments: [
      "Letter of Intent (For external proponent)",
      "PSTD Endorsement Letter (For proposals facilitated by DOST-provincial office)",
      "Profile/School Profile (Attach or incorporate - For external beneficiaries)",
      "Quotation of Equipment (if LIB has equipment outlay)",
      "SEC Registration (For External Proponent or Beneficiary)",
      "Review and Evaluation Form (For proposals facilitated by DOST-provincial office)",
    ],
    approvalDocs: [
      "Approval Letter or Disapproval",
      "Memorandum of Understanding",
      "Letter of Funds Released",
    ],
  },
];

// LGIA subtypes
const lgiaTypes = [
  {
    id: "rnd",
    label: "Research and Development",
    requirements: [
      "Complete Proposal following the DOST Format:",
      "a. DOST Form 2B - Detailed R&D Project Proposal",
      "b. DOST Form 4 - Line-/item-Budget",
      "c. DOST Form 5A and 5B - Workplan, and Expected Output",
      "d. DOST Form 5C - Risk and Assumptions",
    ],
    attachments: [
      "Letter of Intent (For external proponent)",
      "Quotation of Equipment (if LIB has equipment outlay)",
      "Profile/School Profile (Attach or incorporate - For external beneficiaries)",
      "SEC Registration (only when applicable)",
      "Special Order for the designation of the Project Leader by the Head of Office (For external proponent)",
      "Curriculum Vitae Project Leader /Co-Researchers",
      "Board Resolution (only when applicable)",
      "TRB Certificate of Recommendation",
      "Endorsement of the Project by the Head of Office",
      "Review and Evaluation Form",
      "Ethics Clearance (Only when applicable)",
      "Compliance Report (LGIA Form 19)",
      "Clearance from DOST/Funding Agency (only when applicable)",
    ],
  },
  {
    id: "external",
    label: "External Projects and is Non-R&D",
    requirements: [
      "Complete Proposal following the DOST Format:",
      "a. DOST Form 3 - Project Proposal",
      "b. DOST Form 4 - Line-/item-Budget",
      "c. DOST Form 5A and 5B - Workplan, and Expected Outputs",
      "d. DOST Form 5C - Risk and Assumptions (if applicable)",
    ],
    attachments: [
      "Letter of Intent (For external proponent)",
      "Endorsement of the Project by the Head of Office (SUC President or Mayor)",
      "Profile/School Profile (Attach or incorporate - For external beneficiaries)",
      "Quotation of Equipment (if LIB has equipment outlay)",
      "SEC Registration (For External Proponent or Beneficiary)",
      "Special Order for the designation of the Project Leader by the Head of Office (For external proponent)",
      "Curriculum Vitae of Project Leader or Head of Beneficiary Group (For external projects)",
      "Board Resolution (For external proponent)",
      "Review and Evaluation Form (For proposals facilitated by DOST-provincial office)",
      "PSTD Endorsement Letter (For proposals facilitated by DOST-provincial office)",
    ],
  },
  {
    id: "internal",
    label: "Internal Projects with DOST implementers and is Non-R&D",
    requirements: [
      "Complete Proposal following the DOST Format:",
      "a. DOST Form 3 - Project Proposal",
      "b. DOST Form 4 - Line-/item-Budget",
      "c. DOST Form 5A and 5B - Workplan, and Expected Outputs",
      "d. DOST Form 5C - Risk and Assumptions (if applicable)",
    ],
    attachments: [
      "PSTD Endorsement Letter (For proposals facilitated by DOST-provincial office)",
      "Review and Evaluation Form",
    ],
  },
];

// SSCP generic requirements
const sscpRequirements = [
  "Complete Proposal following the DOST Format:",
  "a. DOST Form 3 - Project Proposal",
  "b. DOST Form 4 - Line-/item-Budget",
  "c. DOST Form 5A and 5B - Workplan, and Expected Outputs",
  "d. DOST Form 5C - Risk and Assumptions (if applicable)",
];

const sscpAttachments = [
  "Letter of Intent (For external proponent)",
  "Endorsement of the Project by the Head of Office (SUC President or Mayor)",
  "Profile/School Profile (Attach or incorporate - For external beneficiaries)",
  "Quotation of Equipment (if LIB has equipment outlay)",
  "SEC Registration (For External Proponent or Beneficiary)",
  "Special Order for the designation of the Project Leader by the Head of Office (For external proponent)",
  "Curriculum Vitae of Project Leader or Head of Beneficiary Group (For external projects)",
  "Board Resolution (For external proponent)",
  "Review and Evaluation Form (For proposals facilitated by DOST-provincial office)",
  "PSTD Endorsement Letter (For proposals facilitated by DOST-provincial office)",
];

export default function Create({ program_id }) {
  const { auth } = usePage().props;
  const userRole = auth?.user?.role;
  
  const [selectedProgram, setSelectedProgram] = useState(userRole === 'rpmo' || userRole === 'staff' ? null : program_id);
  const [typeChoice, setTypeChoice] = useState(null);
  
  const currentProgram = programs[selectedProgram] || { name: "Unknown Program" };

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    details: "",
    project_type: "",
    proponent_id: null,
    proponent_name: "",
    proponent_sex: "",
    collaborator_id: null,
    collaborator_name: "",
    beneficiary_id: null,
    beneficiary_name: "",
    beneficiary_leader: "",
    beneficiary_leader_sex: "",
    male_beneficiaries: 0,
    female_beneficiaries: 0,
  });

  // Search states
  const [proponentSearch, setProponentSearch] = useState("");
  const [proponentResults, setProponentResults] = useState([]);
  const [proponentOpen, setProponentOpen] = useState(false);
  
  const [collaboratorSearch, setCollaboratorSearch] = useState("");
  const [collaboratorResults, setCollaboratorResults] = useState([]);
  const [collaboratorOpen, setCollaboratorOpen] = useState(false);
  
  const [beneficiarySearch, setBeneficiarySearch] = useState("");
  const [beneficiaryResults, setBeneficiaryResults] = useState([]);
  const [beneficiaryOpen, setBeneficiaryOpen] = useState(false);

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
  };

  // Clear selections
  const clearProponent = () => {
    setData({
      ...data,
      proponent_id: null,
      proponent_name: "",
      proponent_sex: "",
    });
    setProponentSearch("");
  };

  const clearCollaborator = () => {
    setData({
      ...data,
      collaborator_id: null,
      collaborator_name: "",
    });
    setCollaboratorSearch("");
  };

  const clearBeneficiary = () => {
    setData({
      ...data,
      beneficiary_id: null,
      beneficiary_name: "",
      beneficiary_leader: "",
      beneficiary_leader_sex: "",
      male_beneficiaries: 0,
      female_beneficiaries: 0,
    });
    setBeneficiarySearch("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('proposals.store', selectedProgram));
  };

  // Show program selection for RPMO and Staff
  if ((userRole === 'rpmo' || userRole === 'staff') && !selectedProgram) {
    return (
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 min-h-screen">
        <Head title="Select Program" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[500px]">
            <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">
              Select Program
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Choose a program to create a proposal
            </p>
            <div className="space-y-4">
              {Object.entries(programs).map(([id, program]) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedProgram(parseInt(id));
                    setTypeChoice(null);
                  }}
                  className="w-full px-6 py-4 text-left border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-900"
                >
                  {program.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Pop-up for CEST (program_id 1)
  if (selectedProgram === 1 && !typeChoice) {
    return (
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 min-h-screen">
        <Head title="Select Proposal Type" />
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setSelectedProgram(null);
              setTypeChoice(null);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Program Selection
          </button>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[500px]">
              <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
                Select Proposal Type for CEST
              </h1>
              <div className="space-y-4">
                {cestTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setTypeChoice(type);
                      setData("project_type", type.id);
                    }}
                    className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all font-medium"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Pop-up for LGIA (program_id 2)
  if (selectedProgram === 2 && !typeChoice) {
    return (
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 min-h-screen">
        <Head title="Select Proposal Type" />
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setSelectedProgram(null);
              setTypeChoice(null);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Program Selection
          </button>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-[500px]">
              <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
                Select Proposal Type for LGIA
              </h1>
              <div className="space-y-4">
                {lgiaTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setTypeChoice(type);
                      setData("project_type", type.id);
                    }}
                    className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all font-medium"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Determine which data to show
  const selectedData = 
    selectedProgram === 1 || selectedProgram === 2
      ? typeChoice 
      : { requirements: sscpRequirements, attachments: sscpAttachments }; // SSCP

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gray-50 min-h-screen">
      <Head title={`Create ${currentProgram.name} Proposal`} />

      <div className="max-w-4xl mx-auto">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6"
          onClick={(e) => {
            if ((selectedProgram === 1 || selectedProgram === 2) && typeChoice) {
              e.preventDefault();
              setTypeChoice(null);
              setData("project_type", "");
            } else if ((userRole === 'rpmo' || userRole === 'staff') && selectedProgram) {
              e.preventDefault();
              setSelectedProgram(null);
              setTypeChoice(null);
              setData("project_type", "");
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          {(selectedProgram === 1 || selectedProgram === 2) && typeChoice 
            ? 'Back to Selection' 
            : (userRole === 'rpmo' || userRole === 'staff') && selectedProgram
            ? 'Back to Program Selection'
            : 'Back to Proposals'}
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <div className="flex items-center gap-3 mb-8">
            <Info className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-900">
              {currentProgram.name} Proposal Requirements
              {typeChoice && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({typeChoice.label})
                </span>
              )}
            </h2>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              {selectedData.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Attachments</h3>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              {selectedData.attachments.map((att, i) => (
                <li key={i}>{att}</li>
              ))}
            </ul>
          </div>

          {/* Documents When Project is Approved */}
          {selectedData.approvalDocs && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Documents When Proposal is Approved and Funds Released
              </h3>
              <ul className="list-disc ml-6 space-y-1 text-green-800">
                {selectedData.approvalDocs.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6 border-t pt-6">
            {/* Proposal Title */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Proposal Title *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Details *
              </label>
              <textarea
                value={data.details}
                onChange={(e) => setData("details", e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.details && (
                <p className="text-red-600 text-sm mt-1">{errors.details}</p>
              )}
            </div>

            {/* Proponent Section */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-4">Proponent Information</h3>
              
              {/* Search/Select Proponent */}
              <div className="mb-4 relative">
                <label className="block font-medium text-gray-700 mb-2">
                  Search Existing Proponent (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={proponentSearch}
                    onChange={(e) => {
                      setProponentSearch(e.target.value);
                      searchProponents(e.target.value);
                      setProponentOpen(true);
                    }}
                    onFocus={() => setProponentOpen(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Dropdown Results */}
                {proponentOpen && proponentResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {proponentResults.map((proponent) => (
                      <button
                        key={proponent.proponent_id}
                        onClick={() => selectProponent(proponent)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{proponent.proponent_name}</div>
                        <div className="text-xs text-gray-500">{proponent.sex}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Proponent */}
              {data.proponent_id && (
                <div className="mb-4 bg-white p-3 rounded-lg border border-blue-300 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{data.proponent_name}</p>
                    <p className="text-xs text-gray-500">{data.proponent_sex}</p>
                  </div>
                  <button
                    onClick={clearProponent}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Manual Entry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Proponent Name *
                  </label>
                  <input
                    type="text"
                    value={data.proponent_name}
                    onChange={(e) => setData("proponent_name", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={data.proponent_id ? "From selected proponent" : "Enter name"}
                    required
                    disabled={!!data.proponent_id}
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
                    onChange={(e) => setData("proponent_sex", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!!data.proponent_id}
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
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-gray-800 mb-4">Collaborator Information</h3>
              
              {/* Search/Select Collaborator */}
              <div className="mb-4 relative">
                <label className="block font-medium text-gray-700 mb-2">
                  Search Existing Collaborator (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={collaboratorSearch}
                    onChange={(e) => {
                      setCollaboratorSearch(e.target.value);
                      searchCollaborators(e.target.value);
                      setCollaboratorOpen(true);
                    }}
                    onFocus={() => setCollaboratorOpen(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Dropdown Results */}
                {collaboratorOpen && collaboratorResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {collaboratorResults.map((collaborator) => (
                      <button
                        key={collaborator.collaborator_id}
                        onClick={() => selectCollaborator(collaborator)}
                        className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{collaborator.collaborator_name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Collaborator */}
              {data.collaborator_id && (
                <div className="mb-4 bg-white p-3 rounded-lg border border-purple-300 flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">{data.collaborator_name}</p>
                  <button
                    onClick={clearCollaborator}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Manual Entry */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Collaborator Name (Optional)
                </label>
                <input
                  type="text"
                  value={data.collaborator_name}
                  onChange={(e) => setData("collaborator_name", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={data.collaborator_id ? "From selected collaborator" : "Enter name or leave blank"}
                  disabled={!!data.collaborator_id}
                />
                {errors.collaborator_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.collaborator_name}</p>
                )}
              </div>
            </div>

            {/* Beneficiary Section */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-800 mb-4">Beneficiary Information</h3>
              
              {/* Search/Select Beneficiary */}
              <div className="mb-4 relative">
                <label className="block font-medium text-gray-700 mb-2">
                  Search Existing Beneficiary (Optional)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={beneficiarySearch}
                    onChange={(e) => {
                      setBeneficiarySearch(e.target.value);
                      searchBeneficiaries(e.target.value);
                      setBeneficiaryOpen(true);
                    }}
                    onFocus={() => setBeneficiaryOpen(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Dropdown Results */}
                {beneficiaryOpen && beneficiaryResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    {beneficiaryResults.map((beneficiary) => (
                      <button
                        key={beneficiary.beneficiary_id}
                        onClick={() => selectBeneficiary(beneficiary)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{beneficiary.beneficiary}</div>
                        <div className="text-xs text-gray-500">Leader: {beneficiary.beneficiary_leader} ({beneficiary.beneficiary_leader_sex})</div>
                        <div className="text-xs text-gray-500">Total: {beneficiary.total_beneficiaries} ({beneficiary.male_beneficiaries}M, {beneficiary.female_beneficiaries}F)</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Beneficiary */}
              {data.beneficiary_id && (
                <div className="mb-4 bg-white p-3 rounded-lg border border-green-300 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{data.beneficiary_name}</p>
                    <p className="text-xs text-gray-500">Leader: {data.beneficiary_leader}</p>
                    <p className="text-xs text-gray-500">M: {data.male_beneficiaries}, F: {data.female_beneficiaries}</p>
                  </div>
                  <button
                    onClick={clearBeneficiary}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Manual Entry */}
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    value={data.beneficiary_name}
                    onChange={(e) => setData("beneficiary_name", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder={data.beneficiary_id ? "From selected beneficiary" : "Enter name"}
                    required
                    disabled={!!data.beneficiary_id}
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
                      onChange={(e) => setData("beneficiary_leader", e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      required
                      disabled={!!data.beneficiary_id}
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
                      onChange={(e) => setData("beneficiary_leader_sex", e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      required
                      disabled={!!data.beneficiary_id}
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
                      onChange={(e) => setData("male_beneficiaries", parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      required
                      disabled={!!data.beneficiary_id}
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
                      onChange={(e) => setData("female_beneficiaries", parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      required
                      disabled={!!data.beneficiary_id}
                    />
                    {errors.female_beneficiaries && (
                      <p className="text-red-600 text-sm mt-1">{errors.female_beneficiaries}</p>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-green-300">
                  <p className="text-sm font-medium text-gray-700">
                    Total Beneficiaries: <span className="font-bold text-green-700">{data.male_beneficiaries + data.female_beneficiaries}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/proposals"
                className="px-6 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? "Submitting..." : "Submit Proposal"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}