import { useEffect, useState } from "react";
import type { ServiceRecord } from "../types";
import { serviceRecordsAPI } from "../services/api";
import { FiTool, FiClock, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [records, setRecords] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const data = await serviceRecordsAPI.getAll();
      setRecords(data);
    };
    fetchRecords();
  }, []);

  const totalHours = records
    .reduce((sum, r) => sum + r.serviceTime, 0)
    .toFixed();

  const lastServiceDate = records[0]
    ? new Date(records[0].date).toLocaleDateString()
    : "-";

  return (
    <div className="min-h-screen bg-darkbg text-darktext p-8">
      {/* Overview Cards */}
      <h2 className="text-3xl font-bold mb-2">Service Overview</h2>
      <p className="mb-6 opacity-80">Real-time service records.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-darkcard p-6 rounded-lg shadow border border-primary/40">
            <h3 className="text-sm opacity-70">Total Records</h3>
            <p className="text-3xl font-bold text-secondary">
              {records.length}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="bg-darkcard p-6 rounded-lg shadow border border-primary/40">
            <h3 className="text-sm opacity-70">Last Service Date</h3>
            <p className="text-3xl font-bold text-secondary">
              {lastServiceDate}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-darkcard p-6 rounded-lg shadow border border-primary/40">
            <h3 className="text-sm opacity-70">Total Service Hours</h3>
            <p className="text-3xl font-bold text-secondary">{totalHours}</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <h2 className="text-3xl font-bold mb-2">Recent Service Activity</h2>
      <p className="mb-6 opacity-80">
        <Link
          to="/service-records"
          className="text-secondary font-semibold hover:underline"
        >
          View all records.
        </Link>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {records.slice(0, 6).map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <div
              key={record.id}
              className="bg-darkcard p-6 rounded-lg shadow border border-primary/30 hover:shadow-xl transition-shadow"
            >
              {/* Service Type */}
              <div className="flex items-center gap-2 mb-3">
                <FiTool className="text-secondary text-xl" />
                <h3 className="text-xl font-semibold">{record.serviceType}</h3>
              </div>

              {/* Service Time */}
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <FiClock className="text-secondary" />
                <span>
                  Time: {record.serviceTime} hr
                  {record.serviceTime > 1 ? "s" : ""}
                </span>
              </div>

              {/* Parts */}
              {record.partsUsed && (
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <FiTool className="text-secondary" />
                  <span>Parts: {record.partsUsed}</span>
                </div>
              )}

              {/* Notes */}
              <div className="flex items-center gap-2 opacity-80">
                <FiFileText className="text-secondary" />
                <span>{record.serviceNotes}</span>
              </div>

              {/* Date */}
              <p className="mt-4 text-xs opacity-50">
                {new Date(record.date).toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
