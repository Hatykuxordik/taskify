"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/card";

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

interface ProductivityChartProps {
  tasks: Task[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  tasks,
}) => {
  // Generate productivity data for the last 7 days
  const generateProductivityData = () => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Count tasks created and completed on this date
      const tasksCreated = tasks.filter(
        (task) => task.created_at.split("T")[0] === dateStr
      ).length;

      const tasksCompleted = tasks.filter(
        (task) =>
          task.status === "done" && task.updated_at.split("T")[0] === dateStr
      ).length;

      data.push({
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        created: tasksCreated,
        completed: tasksCompleted,
      });
    }

    return data;
  };

  const productivityData = generateProductivityData();

  // Generate category distribution data
  const generateCategoryData = () => {
    const categoryCount: { [key: string]: number } = {};

    tasks.forEach((task) => {
      const category = task.category || "Uncategorized";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));
  };

  const categoryData = generateCategoryData();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Weekly Productivity Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="created"
              stroke="#8884d8"
              strokeWidth={2}
              name="Tasks Created"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Tasks Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Tasks by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
