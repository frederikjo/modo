"use client";

import React, { useState } from "react";
import {
  Database,
  HardDrive,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { Card } from "../ui/Card";
import { getStorageType } from "@/config/storage";

interface StorageSettingsProps {
  isDark: boolean;
  onStorageTypeChange: (type: "localStorage" | "supabase") => void;
  currentType: "localStorage" | "supabase";
  isLoading?: boolean;
}

export const StorageSettings: React.FC<StorageSettingsProps> = ({
  isDark,
  onStorageTypeChange,
  currentType,
  isLoading = false,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingType, setPendingType] = useState<
    "localStorage" | "supabase"
  >("localStorage");

  const handleTypeChange = (type: "localStorage" | "supabase") => {
    if (type === currentType) return;

    setPendingType(type);
    setShowConfirmation(true);
  };

  const confirmChange = () => {
    onStorageTypeChange(pendingType);
    setShowConfirmation(false);
  };

  const cancelChange = () => {
    setShowConfirmation(false);
  };

  return (
    <Card isDark={isDark} className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings
          className={`${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
          size={24}
        />
        <h2
          className={`text-xl font-light ${
            isDark ? "text-slate-200" : "text-slate-800"
          }`}
        >
          Storage Settings
        </h2>
      </div>

      <div className="space-y-4">
        <p
          className={`text-sm font-light ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Choose where to store your habit data. You can switch
          between options at any time.
        </p>

        {/* localStorage Option */}
        <div
          onClick={() => handleTypeChange("localStorage")}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            currentType === "localStorage"
              ? isDark
                ? "border-emerald-500 bg-emerald-900/20"
                : "border-emerald-500 bg-emerald-50"
              : isDark
              ? "border-slate-600 hover:border-slate-500 bg-slate-800/40"
              : "border-slate-200 hover:border-slate-300 bg-slate-50"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`p-2 rounded-lg ${
                currentType === "localStorage"
                  ? "bg-emerald-500"
                  : isDark
                  ? "bg-slate-700"
                  : "bg-slate-200"
              }`}
            >
              <HardDrive className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3
                  className={`font-medium ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  Local Storage
                </h3>
                {currentType === "localStorage" && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500 text-white">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-sm font-light mt-1 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Store data locally in your browser. Free and fast, but
                data won`t sync across devices.
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span
                  className={`font-light ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  ✓ No API limits
                </span>
                <span
                  className={`font-light ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  ✓ Works offline
                </span>
                <span
                  className={`font-light ${
                    isDark ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  ⚠ No sync
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Supabase Option */}
        <div
          onClick={() => handleTypeChange("supabase")}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            currentType === "supabase"
              ? isDark
                ? "border-blue-500 bg-blue-900/20"
                : "border-blue-500 bg-blue-50"
              : isDark
              ? "border-slate-600 hover:border-slate-500 bg-slate-800/40"
              : "border-slate-200 hover:border-slate-300 bg-slate-50"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`p-2 rounded-lg ${
                currentType === "supabase"
                  ? "bg-blue-500"
                  : isDark
                  ? "bg-slate-700"
                  : "bg-slate-200"
              }`}
            >
              <Database className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3
                  className={`font-medium ${
                    isDark ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  Supabase Database
                </h3>
                {currentType === "supabase" && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white">
                    Active
                  </span>
                )}
              </div>
              <p
                className={`text-sm font-light mt-1 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Store data in the cloud. Syncs across devices but has
                API limits on free plan.
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span
                  className={`font-light ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  ✓ Cross-device sync
                </span>
                <span
                  className={`font-light ${
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  ✓ Backup & restore
                </span>
                <span
                  className={`font-light ${
                    isDark ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  ⚠ API limits
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border ${
            isDark
              ? "bg-amber-900/20 border-amber-700/50"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-start space-x-2">
            <AlertTriangle
              className={`${
                isDark ? "text-amber-400" : "text-amber-600"
              }`}
              size={16}
            />
            <div>
              <p
                className={`text-xs font-light ${
                  isDark ? "text-amber-300" : "text-amber-700"
                }`}
              >
                <strong>Note:</strong> Switching storage types will
                not automatically migrate your existing data. Make
                sure to export your data before switching if needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card isDark={isDark} className="p-6 w-full max-w-md">
            <h3
              className={`text-lg font-light mb-4 ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              Switch Storage Type?
            </h3>
            <p
              className={`text-sm font-light mb-6 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Are you sure you want to switch to{" "}
              {pendingType === "localStorage"
                ? "Local Storage"
                : "Supabase Database"}
              ? This will reload the app and your current session data
              may be lost.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelChange}
                className={`flex-1 px-4 py-2 rounded-lg font-light transition-colors ${
                  isDark
                    ? "border border-slate-600 text-slate-300 hover:bg-slate-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmChange}
                className={`flex-1 px-4 py-2 rounded-lg font-light transition-colors ${
                  isDark
                    ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                Switch
              </button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};
