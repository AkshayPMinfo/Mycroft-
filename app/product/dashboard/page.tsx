import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Placeholder data – in a real app these would come from API / context
const todayFocus = [
  { title: "PRDs awaiting review", count: 2 },
  { title: "Features awaiting prioritization", count: 3 },
  { title: "Roadmaps needing updates", count: 1 },
  { title: "User research awaiting analysis", count: 4 },
];

const recentWork = [
  { title: "Checkout PRD", type: "PRD" },
  { title: "Onboarding Discovery", type: "Discovery" },
  { title: "User Interviews Report", type: "Research" },
  { title: "Q3 Roadmap", type: "Roadmap" },
];

const pendingDecisions = [
  { title: "Feature X launch date", owner: "Alice", due: "2026-07-05", status: "Blocked" },
  { title: "Pricing model approval", owner: "Bob", due: "2026-07-08", status: "Pending" },
];

const upcomingMilestones = [
  { title: "Beta Release", date: "2026-07-15" },
  { title: "Customer Validation", date: "2026-08-01" },
];

const aiRecommendations = [
  "Review Checkout PRD",
  "Prioritize Feature X",
  "Analyse interview notes",
  "Update Q3 roadmap",
];

const aiRisks = [
  "Data sync latency may delay launch",
  "Regulatory compliance pending for payment flow",
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f7fe] p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Current Product</h2>
          <p className="text-lg font-semibold text-gray-800">Mycroft PM</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Quarter Objective</h2>
          <p className="text-lg font-semibold text-gray-800">Increase adoption by 20%</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Active Initiative</h2>
          <p className="text-lg font-semibold text-gray-800">AI‑Driven Insights</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Current Sprint</h2>
          <p className="text-lg font-semibold text-gray-800">Sprint 12 (May 28‑Jun 10)</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Phase</h2>
          <p className="text-lg font-semibold text-gray-800">Build</p>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Workspace (70%) */}
        <section className="flex-1 overflow-y-auto pr-2">
          {/* Today's Focus */}
          <section className="mb-8">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Today's Focus</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayFocus.map((item) => (
                <li
                  key={item.title}
                  className="p-4 bg-white rounded-lg shadow border border-gray-100 flex justify-between items-center"
                >
                  <span>{item.title}</span>
                  <span className="text-sm font-medium text-primary">{item.count}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Product Work */}
          <section className="mb-8">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Recent Product Work</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentWork.map((doc) => (
                <li
                  key={doc.title}
                  className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
                >
                  <p className="font-medium text-gray-800">{doc.title}</p>
                  <p className="text-sm text-gray-500">{doc.type}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Pending Decisions */}
          <section className="mb-8">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Pending Decisions</h3>
            <ul className="space-y-3">
              {pendingDecisions.map((dec) => (
                <li
                  key={dec.title}
                  className="p-4 bg-white rounded-lg shadow border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{dec.title}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      dec.status === "Blocked" && "text-red-600",
                      dec.status === "Pending" && "text-yellow-600",
                      dec.status === "Done" && "text-green-600"
                    )}>{dec.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Owner: {dec.owner} • Due: {dec.due}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Upcoming Milestones */}
          <section className="mb-8">
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Upcoming Milestones</h3>
            <ul className="space-y-2">
              {upcomingMilestones.map((mil) => (
                <li key={mil.title} className="flex justify-between items-center p-2 bg-white rounded-md shadow">
                  <span>{mil.title}</span>
                  <span className="text-sm text-gray-600">{mil.date}</span>
                </li>
              ))}
            </ul>
          </section>
        </section>

        {/* Right AI Copilot (30%) */}
        <aside className="w-80 flex-shrink-0 overflow-y-auto">
          <div className="p-4 bg-white rounded-lg shadow mb-4">
            <h4 className="mb-2 font-medium text-gray-700">Morning Brief</h4>
            <p className="text-sm text-gray-600">Your top priorities today are reviewing the Checkout PRD and updating the Q3 roadmap.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow mb-4">
            <h4 className="mb-2 font-medium text-gray-700">AI Recommendations</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {aiRecommendations.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg shadow mb-4">
            <h4 className="mb-2 font-medium text-gray-700">Risks</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {aiRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg shadow mb-4">
            <h4 className="mb-2 font-medium text-gray-700">Ask Mycroft</h4>
            <input
              type="text"
              placeholder="Ask a question…"
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h4 className="mb-2 font-medium text-gray-700">Recent AI Conversations</h4>
            <p className="text-sm text-gray-500">(placeholder – will appear here)</p>
          </div>
        </aside>
      </div>

      {/* Bottom Quick Actions */}
      <footer className="mt-6 flex flex-wrap gap-3 justify-center">
        {[
          "Create PRD",
          "Start Discovery",
          "Create Roadmap",
          "Analyse Feedback",
          "Prioritize Features",
          "Open AI Product Advisor",
        ].map((label) => (
          <Button key={label} variant="secondary" className="px-4 py-2">
            {label}
          </Button>
        ))}
      </footer>
    </div>
  );
}
