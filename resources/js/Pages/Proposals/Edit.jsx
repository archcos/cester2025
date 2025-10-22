import { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { ChevronLeft, Info, Save, X, FileText, Tag, AlertCircle, Trash2 } from "lucide-react";

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

  const { data, setData, put, processing, errors } = useForm({
    title: proposal.title || "",
    details: proposal.details || "",
    project_type: proposal.project_type || "",
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

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <Head title={`Edit Proposal: ${proposal.title}`} />

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/proposals`}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 hover:gap-3 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Proposal
        </Link>

        {/* Warning Banner if not pending */}
        {proposal.status !== 'Pending' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Cannot Edit Proposal</h3>
                <p className="text-sm text-red-700">
                  This proposal has a status of "{proposal.status}" and cannot be edited. 
                  Only pending proposals can be modified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Edit Proposal</h1>
                  <div className="flex items-center gap-3 text-blue-100">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm">{program.name} Program</span>
                  </div>
                </div>
              </div>
              
              {/* Delete Button */}
              {proposal.status === 'Pending' && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2.5 rounded-xl transition-all duration-200 font-medium border border-red-400/30"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Proposal
                </button>
              )}
            </div>

            {/* Unsaved Changes Indicator */}
            {hasChanges && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
            )}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Proposal ID Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-blue-900">
                <Info className="w-4 h-4" />
                <span>
                  Proposal ID: <span className="font-mono font-semibold">#{proposal.proposal_id}</span>
                  {" • "}Status: <span className="font-semibold">{proposal.status}</span>
                </span>
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  disabled={proposal.status !== 'Pending'}
                >
                  <option value="">Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.project_type && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter a descriptive title for your proposal"
                required
                disabled={proposal.status !== 'Pending'}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.title && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {data.title.length} / 255 characters
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Provide detailed information about your proposal, including objectives, methodology, expected outcomes, and any other relevant details..."
                required
                disabled={proposal.status !== 'Pending'}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.details && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.details}
                  </p>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {data.details.length} / 5000 characters
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href={`/proposals/${proposal.proposal_id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>

              {proposal.status === 'Pending' && (
                <button
                  type="submit"
                  disabled={processing || !hasChanges}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  {processing ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Editing Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Only proposals with "Pending" status can be edited.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Make sure your title is clear and descriptive (maximum 255 characters).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Provide comprehensive details about your proposal (maximum 5000 characters).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Changes are saved only when you click "Save Changes".</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}