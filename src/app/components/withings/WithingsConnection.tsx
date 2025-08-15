import React from "react";
import { Scale, ExternalLink, Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "../ui/Card";
import { useWithings } from "@/hooks/useWithings";

interface WithingsConnectionProps {
  isDark: boolean;
}

export const WithingsConnection: React.FC<WithingsConnectionProps> = ({
  isDark,
}) => {
  const {
    isConnected,
    loading,
    error,
    latestWeight,
    weightTrend,
    connect,
    disconnect,
    clearError,
  } = useWithings();

  const handleConnect = () => {
    try {
      const authUrl = connect();
      window.location.href = authUrl;
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  const formatWeight = (weight: number, unit: 'kg' | 'lbs' = 'kg'): string => {
    return `${weight.toFixed(1)} ${unit}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card isDark={isDark} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Scale
            className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
            size={24}
          />
          <div>
            <h3
              className={`text-lg font-light ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              Weight Tracking
            </h3>
            <p
              className={`text-sm font-light ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {isConnected ? "Connected to Withings" : "Connect your Withings scale"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-emerald-400" : "bg-emerald-500"
              }`}
            />
          )}
          <span
            className={`text-xs font-light ${
              isConnected
                ? isDark
                  ? "text-emerald-400"
                  : "text-emerald-600"
                : isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {isConnected ? "Connected" : "Not connected"}
          </span>
        </div>
      </div>

      {error && (
        <div
          className={`p-3 rounded-lg mb-4 border ${
            isDark
              ? "bg-red-900/20 border-red-700/50 text-red-300"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-light">{error}</p>
            <button
              onClick={clearError}
              className={`text-xs underline ml-2 ${
                isDark
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-600 hover:text-red-500"
              }`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {!isConnected ? (
        <div className="text-center py-6">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isDark ? "bg-slate-700" : "bg-slate-100"
            }`}
          >
            <Scale
              className={`${isDark ? "text-slate-400" : "text-slate-500"}`}
              size={32}
            />
          </div>
          <p
            className={`text-sm font-light mb-4 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Connect your Withings scale to automatically track your weight and
            body composition data.
          </p>
          <button
            onClick={handleConnect}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-light transition-colors mx-auto ${
              loading
                ? isDark
                  ? "bg-slate-700 text-slate-400"
                  : "bg-slate-200 text-slate-500"
                : isDark
                ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            }`}
          >
            <ExternalLink size={16} />
            <span>{loading ? "Connecting..." : "Connect Withings"}</span>
          </button>
        </div>
      ) : (
        <div>
          {latestWeight ? (
            <div className="mb-6">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <div
                    className={`text-3xl font-light ${
                      isDark ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {formatWeight(latestWeight.weight)}
                  </div>
                  <div
                    className={`text-sm font-light ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {formatDate(latestWeight.date)}
                  </div>
                </div>
                
                {weightTrend && (
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {weightTrend.trend === 'up' ? (
                        <TrendingUp
                          className={`${
                            isDark ? "text-orange-400" : "text-orange-500"
                          }`}
                          size={16}
                        />
                      ) : weightTrend.trend === 'down' ? (
                        <TrendingDown
                          className={`${
                            isDark ? "text-emerald-400" : "text-emerald-500"
                          }`}
                          size={16}
                        />
                      ) : (
                        <Minus
                          className={`${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                          size={16}
                        />
                      )}
                      <span
                        className={`text-sm font-light ${
                          weightTrend.trend === 'up'
                            ? isDark
                              ? "text-orange-400"
                              : "text-orange-500"
                            : weightTrend.trend === 'down'
                            ? isDark
                              ? "text-emerald-400"
                              : "text-emerald-500"
                            : isDark
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        {Math.abs(weightTrend.change).toFixed(1)}kg
                      </span>
                    </div>
                    <div
                      className={`text-xs font-light ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      7 day trend
                    </div>
                  </div>
                )}
              </div>

              {latestWeight.fatRatio && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-opacity-20 border-slate-500">
                  <div>
                    <div
                      className={`text-lg font-light ${
                        isDark ? "text-slate-200" : "text-slate-800"
                      }`}
                    >
                      {latestWeight.fatRatio.toFixed(1)}%
                    </div>
                    <div
                      className={`text-xs font-light ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Body Fat
                    </div>
                  </div>
                  {latestWeight.fatFreeMass && (
                    <div>
                      <div
                        className={`text-lg font-light ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {formatWeight(latestWeight.fatFreeMass)}
                      </div>
                      <div
                        className={`text-xs font-light ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Muscle Mass
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Zap
                className={`w-12 h-12 mx-auto mb-2 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <p
                className={`text-sm font-light ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                No weight data available yet. Step on your Withings scale to see
                your latest measurements here.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-opacity-20 border-slate-500">
            <button
              className={`text-sm font-light underline ${
                isDark
                  ? "text-slate-400 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-600"
              }`}
            >
              View History
            </button>
            <button
              onClick={disconnect}
              className={`text-sm font-light underline ${
                isDark
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-500 hover:text-red-600"
              }`}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};