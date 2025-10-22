import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft, Info } from "lucide-react";

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
  const [typeChoice, setTypeChoice] = useState(null);
  const program = programs[program_id] || { name: "Unknown Program" };

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    details: "",
    project_type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('proposals.store', program_id));
  };

  // Pop-up for CEST (program_id 1)
  if (program_id === 1 && !typeChoice) {
    return (
      <div className="flex items-center justify-center">
        <Head title="Select Proposal Type" />
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
    );
  }

  // Pop-up for LGIA (program_id 2)
  if (program_id === 2 && !typeChoice) {
    return (
      <div className="flex items-center justify-center">
        <Head title="Select Proposal Type" />
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
    );
  }

  // Determine which data to show
  const selectedData = 
    program_id === 1 || program_id === 2
      ? typeChoice 
      : { requirements: sscpRequirements, attachments: sscpAttachments }; // SSCP

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <Head title={`Create ${program.name} Proposal`} />

      <div className="max-w-4xl mx-auto">
        <Link
          href="/proposals"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6"
          onClick={(e) => {
            // If CEST or LGIA, go back to type selection instead
            if ((program_id === 1 || program_id === 2) && typeChoice) {
              e.preventDefault();
              setTypeChoice(null);
              setData("project_type", "");
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          {(program_id === 1 || program_id === 2) && typeChoice ? 'Back to Selection' : 'Back to Proposals'}
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-900">
              {program.name} Proposal Requirements
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

          {/* Documents When Project is Approved (CEST only) */}
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
          <form onSubmit={handleSubmit} className="space-y-6 border-t pt-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Proposal Title
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

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Details
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

            <div className="flex justify-end gap-3">
              <Link
                href="/proposals"
                className="px-6 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? "Submitting..." : "Submit Proposal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}