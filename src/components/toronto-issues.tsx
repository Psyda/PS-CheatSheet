// src/components/toronto-issues.tsx
"use client"

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, Home } from 'lucide-react';

const rentData = [
  { year: 2019, rent: 2200 },
  { year: 2020, rent: 2150 },
  { year: 2021, rent: 2300 },
  { year: 2022, rent: 2500 },
  { year: 2023, rent: 2800 },
  { year: 2024, rent: 3100 }
];

export function TorontoIssues() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const issues = [
    {
      id: 'housing',
      title: 'Housing Crisis in Toronto',
      icon: <Home className="w-6 h-6" />,
      stats: [
        { label: 'Average 1BR Rent', value: '$3,100' },
        { label: 'Vacancy Rate', value: '1.2%' },
        { label: 'Avg. Income Spent on Housing', value: '48%' }
      ],
      parties: {
        conservative: {
          quote: "\"We will protect your property investments. We won't let them crash to appease the radical few.\"",
          speaker: "CPC Leader to Real Estate Investment Forum",
          plans: [
            "Sell public land to private developers",
            "Focus on single-family homes",
            "Remove 'red tape' from development process"
          ]
        },
        liberal: {
          quote: "Your housing investments are safe. We're taking a balanced approach.",
          speaker: "LPC Leader at Toronto Economic Club",
          plans: [
            "First-time home buyer incentive",
            "Foreign buyers ban",
            "Housing accelerator fund"
          ]
        },
        ndp: {
          quote: "Toronto shouldn't only be for the one percent. Everyone deserves an affordable home.",
          speaker: "NDP Leader at Community Housing Rally",
          plans: [
            "Introduce Homes Ontario program",
            "Legalize fourplexes citywide",
            "Restore full rent control",
            "Fund non-profit and co-op housing"
          ]
        }
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Top Issues Affecting Toronto Residents</h1>
      
      {issues.map((issue) => (
        <div key={issue.id} className="border rounded-lg shadow-sm bg-white">
          <button
            onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {issue.icon}
              <span className="text-xl font-semibold">{issue.title}</span>
            </div>
            <ChevronDown className={`w-5 h-5 transform transition-transform ${selectedIssue === issue.id ? 'rotate-180' : ''}`} />
          </button>
          
          {selectedIssue === issue.id && (
            <div className="p-6 border-t">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {issue.stats.map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="mb-8 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="rent" stroke="#2563eb" fill="#93c5fd" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(issue.parties).map(([party, data]) => (
                  <div key={party} className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 capitalize">{party}</h3>
                    <blockquote className="border-l-4 pl-4 mb-4 italic">
                      {data.quote}
                      <footer className="text-sm text-gray-600 mt-2">
                        - {data.speaker}
                      </footer>
                    </blockquote>
                    <div className="space-y-2">
                      <h4 className="font-medium">Proposed Solutions:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {data.plans.map((plan, index) => (
                          <li key={index}>{plan}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}