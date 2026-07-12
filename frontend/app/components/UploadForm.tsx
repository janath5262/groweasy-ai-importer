"use client";

import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("import");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setStep(2);

    try {
      const response = await fetch(
        "https://groweasy-ai-importer-2-szjo.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const text = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", text);

      if (!response.ok) {
        throw new Error(text);
      }

      const data = JSON.parse(text);

      console.log("Backend Response:", data);

      setResult(data);
      setStep(3);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const filteredResults =
    result?.results?.filter(
      (customer: any) =>
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.company?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-700">GrowEasy</h2>

            <p className="text-gray-500 font-medium">AI CSV Importer</p>
          </div>

          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("import")}
              className={`font-bold ${
                activeTab === "import" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Import
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`font-bold ${
                activeTab === "history" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      <div className="flex justify-center p-10">
        {activeTab === "import" ? (
          <div className="bg-white/90 backdrop-blur-lg rounded-[32px] shadow-2xl border border-gray-200 p-10">
            {/* Keep all your existing code here unchanged */}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-lg rounded-[32px] shadow-2xl border border-gray-200 p-10">
            <h2 className="text-4xl font-bold mb-8">Upload History</h2>

            <p className="text-gray-500">No upload history available.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center p-10">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl mx-auto p-12">
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {/* Header */}

          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm shadow">
              GROWEASY AI ASSIGNMENT
            </span>
          </div>

          <h1 className="text-7xl font-black tracking-tight text-gray-900">
            GrowEasy AI Importer
          </h1>

          <p className="text-center text-gray-600 mt-6 text-xl font-medium max-w-3xl mx-auto">
            Upload your CSV and let AI transform customer data.
          </p>

          {/* Progress Bar */}

          <div className="flex justify-center items-center mt-12 mb-12 gap-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span className="font-bold text-lg">Upload</span>
            </div>

            <div className="w-20 h-1 bg-gray-300 rounded"></div>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 2
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="text-gray-500 font-semibold">AI Mapping</span>
            </div>

            <div className="w-20 h-1 bg-gray-300 rounded"></div>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  step >= 3
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span className="text-gray-500 font-semibold">Results</span>
            </div>
          </div>

          {/* Upload Area */}

          <div className="flex flex-col items-center mt-10">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`w-full max-w-3xl h-72 border-2 border-dashed rounded-3xl cursor-pointer flex flex-col justify-center items-center transition-all duration-300 shadow-xl

${
  dragActive
    ? "border-green-500 bg-green-50 scale-105"
    : "border-blue-400 bg-white hover:bg-blue-50 hover:shadow-2xl"
}`}
            >
              <div className="mb-5">
                <UploadCloud
                  size={70}
                  className={`transition-all duration-300 ${
                    dragActive ? "text-green-500 scale-110" : "text-blue-500"
                  }`}
                />
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mt-4">
                {dragActive ? "Drop CSV Here" : "Drag & Drop or Click"}
              </h2>

              <p className="text-gray-500 text-lg mt-3">CSV files only</p>

              {file && (
                <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-xl font-semibold shadow-md">
                  ✅ {file.name}
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-8 px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                  AI Processing...
                </>
              ) : (
                <>🚀 Upload & Process CSV</>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-14">
              <h2 className="text-3xl font-bold mb-8">Import Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="rounded-3xl p-8 shadow-xl bg-gradient-to-br from-green-100 to-green-50 hover:scale-105 transition-all duration-300">
                  <p className="text-xl text-gray-500 mt-5 max-w-3xl mx-auto leading-8">
                    Total Rows
                  </p>
                  <h2 className="text-6xl font-black text-blue-700 mt-3">
                    {result.totalRows}
                  </h2>
                </div>

                <div className="rounded-3xl p-8 shadow-xl bg-gradient-to-br from-blue-100 to-blue-50 hover:scale-105 transition-all duration-300">
                  <p className="text-gray-500 text-lg font-semibold">
                    Processed Rows
                  </p>
                  <h2 className="text-6xl font-black text-green-700 mt-3">
                    {result.processedRows}
                  </h2>
                </div>

                <div className="rounded-3xl p-8 shadow-xl bg-gradient-to-br from-purple-100 to-pink-100 hover:scale-105 transition-all duration-300">
                  <p className="text-gray-500 text-lg font-semibold">
                    AI Status
                  </p>
                  <h2 className="text-4xl font-black text-emerald-600 mt-3">
                    Success ✅
                  </h2>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="🔍 Search by Name, Email or Company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="overflow-x-auto rounded-xl shadow-lg">
                <table className="min-w-full">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Country</th>
                      <th className="p-4 text-left">Mobile</th>
                      <th className="p-4 text-left">Company</th>
                      <th className="p-4 text-left">City</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(result?.results) ? (
                      filteredResults.map((customer: any, index: number) => (
                        <tr
                          key={index}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100`}
                        >
                          <td className="p-4 text-gray-800 font-medium">
                            {customer.name}
                          </td>
                          <td className="p-4 text-gray-800 font-medium">
                            {customer.email}
                          </td>
                          <td className="p-4 text-gray-800 font-medium">
                            {customer.country_code}
                          </td>
                          <td className="p-4 text-gray-800 font-medium">
                            {customer.mobile_without_country_code}
                          </td>
                          <td className="p-4 text-gray-800 font-medium">
                            {customer.company}
                          </td>
                          <td className="p-4 text-gray-800 font-medium">
                            {customer.city}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-6 text-center text-red-500"
                        >
                          No matching customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
