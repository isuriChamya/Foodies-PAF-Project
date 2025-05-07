import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PlanList = ({ plans }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gradient-to-r from-orange-50 via-rose-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Learning Plans
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="backdrop-blur-md bg-white/70 border border-orange-100 rounded-2xl shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl duration-300 cursor-pointer overflow-hidden"
            onClick={() => {
              navigate("/plans/" + plan.id);
            }}
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-t-2xl">
              <h2 className="text-2xl font-bold tracking-wide">{plan.title}</h2>
              <p className="text-sm mt-1 opacity-90">
                {plan.category} &bull; {plan.skillLevel}
              </p>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {plan.description}
              </p>

              {/* Stats */}
              <div className="flex justify-between text-xs text-gray-600 font-medium">
                <span>⏱ {plan.estimatedHours} hrs</span>
                <span>✅ {plan.completionPercentage.toFixed(0)}% complete</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {plan.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <img
                  src={
                    plan.owner.profileImageUrl ||
                    "https://via.placeholder.com/40"
                  }
                  alt={plan.owner.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {plan.owner.firstName} {plan.owner.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{plan.owner.username}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanList;
