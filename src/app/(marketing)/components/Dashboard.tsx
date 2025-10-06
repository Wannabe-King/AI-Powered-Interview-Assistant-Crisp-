"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import {
  getInterviewStats,
  searchInterviewSessions,
} from "@/lib/interviewService";

interface InterviewSession {
  id: string;
  user_name: string;
  user_email: string;
  user_mobile: string;
  time_spent: number;
  completed_at: string;
  created_at: string;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load initial stats
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await getInterviewStats();
      setStats(statsData);
      setSessions(statsData.recentSessions || []);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadStats();
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchInterviewSessions(searchTerm);
      setSessions(searchResults);
    } catch (error) {
      console.error("Error searching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <TabsContent value="interviewer">
      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-600">
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.totalSessions}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-600">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.totalUsers}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-600">
                  Avg. Time Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-300">
                  {stats.averageTimeSpent
                    ? formatTime(Math.round(stats.averageTimeSpent))
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Interview Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  loadStats();
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Interview Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No interview sessions found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Mobile</th>
                      <th className="text-left py-3 px-4">Time Spent</th>
                      <th className="text-left py-3 px-4">Completed</th>
                      <th className="text-left py-3 px-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {session.user_name}
                        </td>
                        <td className="py-3 px-4">{session.user_email}</td>
                        <td className="py-3 px-4">{session.user_mobile}</td>
                        <td className="py-3 px-4">
                          {session.time_spent
                            ? formatTime(session.time_spent)
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {session.completed_at
                            ? formatDate(session.completed_at)
                            : "In Progress"}
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(session.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
