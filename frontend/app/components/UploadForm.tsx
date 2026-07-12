"use client";

import { useState, useRef } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
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

    try {
      const response = await fetch(
        "https://groweasy-ai-importer-2-szjo.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      console.log("Backend Response:", data);

      setResult(data);

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
        throw new Error("CSV upload failed. Please check the backend server.");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Upload failed");
      setError(
        "Cannot connect to the backend. Please ensure the backend server is running.",
      );
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
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-10">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {/* Header */}

        <h1 className="text-5xl font-bold text-center">GrowEasy AI Importer</h1>

        <p className="text-center text-gray-500 mt-3 text-lg">
          Upload your CSV and let AI transform customer data.
        </p>

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
            className={`w-full max-w-3xl h-56 border-2 border-dashed rounded-2xl cursor-pointer flex flex-col justify-center items-center transition-all duration-300
            ${
              dragActive
                ? "border-green-500 bg-green-50"
                : "border-blue-500 hover:bg-blue-50"
            }`}
          >
            <div className="text-6xl">{dragActive ? "📥" : "📄"}</div>

            <h2 className="text-2xl font-semibold mt-4">
              {dragActive ? "Drop CSV Here" : "Drag & Drop or Click"}
            </h2>

            <p className="text-gray-500 mt-2">CSV files only</p>

            {file && (
              <div className="mt-5 bg-green-100 text-green-700 px-5 py-2 rounded-lg font-medium">
                ✅ {file.name}
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl flex items-center gap-3 disabled:bg-gray-400 transition"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {loading ? "Processing..." : "Upload CSV"}
          </button>
        </div>

        {result && (
          <div className="mt-14">
            <h2 className="text-3xl font-bold mb-8">Import Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-green-100 rounded-xl p-6 shadow">
                <p className="text-gray-600">Total Rows</p>
                <h2 className="text-4xl font-bold mt-2">{result.totalRows}</h2>
              </div>

              <div className="bg-blue-100 rounded-xl p-6 shadow">
                <p className="text-gray-600">Processed Rows</p>
                <h2 className="text-4xl font-bold mt-2">
                  {result.processedRows}
                </h2>
              </div>

              <div className="bg-purple-100 rounded-xl p-6 shadow">
                <p className="text-gray-600">AI Status</p>
                <h2 className="text-2xl font-bold mt-2 text-green-600">
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
                        <td className="p-4">{customer.name}</td>
                        <td className="p-4">{customer.email}</td>
                        <td className="p-4">{customer.country_code}</td>
                        <td className="p-4">
                          {customer.mobile_without_country_code}
                        </td>
                        <td className="p-4">{customer.company}</td>
                        <td className="p-4">{customer.city}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-red-500">
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
    </main>
  );
}
