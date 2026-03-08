import { useEffect, useState } from "react";
import type { ServiceRecord } from "../types";
import { serviceRecordsAPI } from "../services/api";
import { aiAPI } from "../services/api";
import { motion } from "framer-motion";

const ServiceRecords = () => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(
    null,
  );

  // AI Chat state
  const [aiInput, setAiInput] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiMessages, setAiMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    serviceType: "",
    serviceTime: "",
    equipmentId: "",
    equipmentType: "",
    technician: "",
    partsUsed: "",
    serviceNotes: "",
  });

  // -----------------------
  // Fetch records on mount and when filters change
  // -----------------------
  useEffect(() => {
    const fetchRecords = async () => {
      const data = await serviceRecordsAPI.getAll({ search, dateFrom, dateTo });
      setRecords(data);
    };
    fetchRecords();
  }, [search, dateFrom, dateTo]);

  // -----------------------
  // No client-side filtering needed
  // -----------------------

  // -----------------------
  // Helpers: Form and Modal
  // -----------------------
  const clearForm = () => {
    setFormData({
      date: "",
      serviceType: "",
      serviceTime: "",
      equipmentId: "",
      equipmentType: "",
      technician: "",
      partsUsed: "",
      serviceNotes: "",
    });
  };

  const openAddModal = () => {
    setEditingRecord(null); // Add mode
    clearForm();
    setShowModal(true);
  };

  const openEditModal = (record: ServiceRecord) => {
    setEditingRecord(record); // Edit mode
    setFormData({
      date: record.date.split("T")[0],
      serviceType: record.serviceType,
      serviceTime: record.serviceTime.toString(),
      equipmentId: record.equipmentId,
      equipmentType: record.equipmentType,
      technician: record.technician,
      partsUsed: record.partsUsed || "",
      serviceNotes: record.serviceNotes,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    clearForm();
  };

  // -----------------------
  // Handle Submit (Add/Edit)
  // -----------------------
  const handleSubmit = async () => {
    if (editingRecord) {
      // ------------------- Edit -------------------
      try {
        const updated = await serviceRecordsAPI.update(editingRecord.id, {
          date: formData.date,
          serviceType: formData.serviceType,
          serviceTime: parseFloat(formData.serviceTime),
          equipmentId: formData.equipmentId,
          equipmentType: formData.equipmentType,
          technician: formData.technician,
          partsUsed: formData.partsUsed || null,
          serviceNotes: formData.serviceNotes,
        });

        setRecords(
          records.map((r) => (r.id === editingRecord.id ? updated : r)),
        );
        closeModal();
      } catch (error) {
        alert("Failed to update record");
      }
    } else {
      // ------------------- Add -------------------
      try {
        const newRecord = await serviceRecordsAPI.create({
          date: formData.date,
          serviceType: formData.serviceType,
          serviceTime: parseFloat(formData.serviceTime),
          equipmentId: formData.equipmentId,
          equipmentType: formData.equipmentType,
          technician: formData.technician,
          partsUsed: formData.partsUsed || null,
          serviceNotes: formData.serviceNotes,
        });

        setRecords([newRecord, ...records]);
        closeModal();
      } catch (error) {
        alert("Failed to create record");
      }
    }
  };

  // -----------------------
  // Delete Record
  // -----------------------
  const handleDelete = async (id: string) => {
    try {
      await serviceRecordsAPI.delete(id);
      setRecords(records.filter((r) => r.id !== id));
    } catch (error) {
      alert("Failed to delete record");
    }
  };

  // -----------------------
  // AI Chat Functions
  // -----------------------
  const handleAIQuery = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { text: aiInput, isUser: true };
    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setAiLoading(true);

    try {
      const response = await aiAPI.query(aiInput);
      let messageText: string;
      if (response.error) {
        messageText = response.error;
      } else {
        messageText = JSON.stringify(response.result, null, 2);
      }
      const aiMessage = { text: messageText, isUser: false };
      setAiMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Sorry, the quota for this AI usage has been exceeded. Please try later.",
        isUser: false,
      };
      setAiMessages((prev) => [...prev, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkbg text-darktext p-8">
      <h2 className="text-3xl font-bold mb-2">Service Records</h2>
      <p className="mb-6 opacity-80">History of all maintenance and repairs.</p>

      {/* Date Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-wrap gap-4 mb-4"
      >
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </motion.div>

      {/* AI Chat Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="mb-6"
      >
        <div className="bg-darkcard rounded-lg p-4 border border-primary/30">
          <h3 className="text-lg font-semibold text-secondary mb-3">
            🤖 AI Assistant
          </h3>

          <p className="text-sm text-secondary mb-3">
            Ask questions about your service records. Try: "What is the total
            service time for equipment ABC?" or "When was the last service?"
          </p>

          <div className="h-32 overflow-y-auto mb-3 space-y-2">
            {aiMessages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  msg.isUser
                    ? "bg-primary text-darktext ml-auto max-w-md"
                    : "bg-darkinput text-darktext mr-auto max-w-md"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              </div>
            ))}
            {aiLoading && (
              <div className="bg-darkinput text-darktext p-2 rounded mr-auto max-w-md text-sm">
                Thinking...
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAIQuery()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              disabled={aiLoading}
            />
            <button
              onClick={handleAIQuery}
              disabled={aiLoading || !aiInput.trim()}
              className="bg-primary text-darktext px-3 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
            >
              Ask
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search + Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by notes, technician or service type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full md:w-1/3 px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            onClick={openAddModal}
            className="ml-4 bg-primary text-darktext px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Add Record
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full bg-darkcard rounded-lg shadow border border-primary/30">
            <thead>
              <tr className="border-b border-primary/50">
                <th className="px-6 py-3 text-left text-secondary text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-secondary text-sm font-semibold">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-secondary text-sm font-semibold">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-secondary text-sm font-semibold">
                  Time (hrs)
                </th>
                <th className="px-6 py-3 text-left text-secondary text-sm font-semibold">
                  Equipment ID
                </th>
                <th className="px-6 py-3 text-left text-secondary text-sm font-semibold">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-secondary text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/30">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{record.serviceType}</td>
                    <td className="px-6 py-4">{record.technician}</td>
                    <td className="px-6 py-4">{record.serviceTime}</td>
                    <td className="px-6 py-4">{record.equipmentId}</td>
                    <td className="px-6 py-4">{record.serviceNotes}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        className="px-3 py-1 bg-secondary text-darkcard rounded hover:bg-secondary/80 transition"
                        onClick={() => openEditModal(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-primary text-darktext rounded hover:bg-primary/80 transition"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No matching records. Please try again.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* -----------------------
          Modal (Single for Add/Edit)
      ----------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-darkcard p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingRecord ? "Edit Record" : "Add Record"}
            </h3>

            <div className="space-y-2">
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
              <input
                type="text"
                placeholder="Service Type"
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
              <input
                type="number"
                placeholder="Time (hrs)"
                value={formData.serviceTime}
                onChange={(e) =>
                  setFormData({ ...formData, serviceTime: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
              <input
                type="text"
                placeholder="Technician"
                value={formData.technician}
                onChange={(e) =>
                  setFormData({ ...formData, technician: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
              <input
                type="text"
                placeholder="Equipment ID"
                value={formData.equipmentId}
                onChange={(e) =>
                  setFormData({ ...formData, equipmentId: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
              <input
                type="text"
                placeholder="Equipment Type"
                value={formData.equipmentType}
                onChange={(e) =>
                  setFormData({ ...formData, equipmentType: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
              <input
                type="text"
                placeholder="Parts Used"
                value={formData.partsUsed}
                onChange={(e) =>
                  setFormData({ ...formData, partsUsed: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
              <textarea
                placeholder="Service Notes"
                value={formData.serviceNotes}
                onChange={(e) =>
                  setFormData({ ...formData, serviceNotes: e.target.value })
                }
                className="w-full px-3 py-2 rounded bg-darkinput border border-gray-600 text-darktext"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-primary hover:bg-primary-dark"
              >
                {editingRecord ? "Save Changes" : "Add Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecords;
