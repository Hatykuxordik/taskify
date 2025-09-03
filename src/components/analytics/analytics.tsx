"use client";

import React from "react";
import { TaskStats } from "./task-stats";
import { ProductivityChart } from "./productivity-chart";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category?: string | null;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface AnalyticsProps {
  tasks?: Task[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks = [] }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Analytics Dashboard
      </h2>
      <TaskStats tasks={tasks} />
      <ProductivityChart tasks={tasks} />
    </div>
  );
};

export default Analytics;
