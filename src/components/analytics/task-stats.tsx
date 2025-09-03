"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityStats = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Total Tasks</h3>
          <p className="text-3xl font-bold text-primary">{totalTasks}</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Completed</h3>
          <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
          <Badge variant="secondary" className="mt-1">
            {completionRate}% completion rate
          </Badge>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">In Progress</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {inProgressTasks}
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">To Do</h3>
          <p className="text-3xl font-bold text-red-600">{todoTasks}</p>
        </div>
      </Card>

      <Card className="p-4 md:col-span-2 lg:col-span-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Priority Distribution
        </h3>
        <div className="flex justify-around">
          <div className="text-center">
            <Badge variant="destructive" className="mb-1">
              High Priority
            </Badge>
            <p className="text-2xl font-bold">{priorityStats.high}</p>
          </div>
          <div className="text-center">
            <Badge variant="default" className="mb-1">
              Medium Priority
            </Badge>
            <p className="text-2xl font-bold">{priorityStats.medium}</p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-1">
              Low Priority
            </Badge>
            <p className="text-2xl font-bold">{priorityStats.low}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
