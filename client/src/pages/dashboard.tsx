import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Person } from "@shared/schema";
import { type ApiResponse } from "@/lib/types";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PersonList } from "@/components/person-list";
import { PersonForm } from "@/components/person-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus, 
  Search, 
  BarChart3,
  Database,
  Share2,
  Plus,
  TrendingUp
} from "lucide-react";
import { useLocation, Route, Switch } from "wouter";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  // Fetch person count
  const { data: countData } = useQuery({
    queryKey: ["/person/count"],
    queryFn: async () => {
      const response = await fetch("/person/count", { credentials: "include" });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  // Fetch recent persons for statistics
  const { data: statsData } = useQuery<ApiResponse<Person[]>>({
    queryKey: ["/person/list", { page: 1, limit: 100 }],
    queryFn: async ({ queryKey }) => {
      const [endpoint, params] = queryKey as [string, any];
      const searchParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value));
        });
      }
      
      const url = `${endpoint}?${searchParams.toString()}`;
      const response = await fetch(url, { credentials: "include" });
      
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  const totalPersons = countData?.count || 0;
  const persons = statsData?.data || [];
  
  // Calculate simple statistics
  const avgStatementLength = persons.length > 0 
    ? Math.round(persons.reduce((sum, p) => sum + p.personalStatement.length, 0) / persons.length)
    : 0;

  const StatsCards = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Persons</p>
              <p className="text-2xl font-bold text-gray-900">{totalPersons}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">Active</span>
            <span className="text-gray-600 ml-2">records</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Statement Length</p>
              <p className="text-2xl font-bold text-gray-900">{avgStatementLength}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">characters</span>
            <span className="text-gray-600 ml-2">average</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Sources</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="p-3 bg-cyan-100 rounded-lg">
              <Database className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">Active</span>
            <span className="text-gray-600 ml-2">connection</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quick Actions</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Share2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">Available</span>
            <span className="text-gray-600 ml-2">tools</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const QuickActions = () => (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Quick Actions</CardTitle>
          <Button onClick={() => window.location.href = "/persons/new"}>
            <Plus className="w-4 h-4 mr-2" />
            New Person
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-start text-left"
            onClick={() => window.location.href = "/persons/new"}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Add Person</h4>
                <p className="text-sm text-gray-600">Create a new person record</p>
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-start text-left"
            onClick={() => window.location.href = "/"}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Search & Filter</h4>
                <p className="text-sm text-gray-600">Find specific person records</p>
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-start text-left"
            onClick={() => window.location.href = "/analytics"}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-600">Analyze person data trends</p>
              </div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title="Person Data Management"
          subtitle="Manage and analyze person data with ease"
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 lg:p-8">
            <Switch>
              <Route path="/">
                <StatsCards />
                <QuickActions />
                <PersonList />
              </Route>
              
              <Route path="/persons/new">
                <PersonForm />
              </Route>
              
              <Route path="/persons/:id/edit">
                {(params) => {
                  // In a real app, you'd fetch the person data here
                  return <PersonForm />;
                }}
              </Route>
              
              <Route path="/persons">
                <PersonList />
              </Route>
              
              <Route>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Page Under Construction
                      </h3>
                      <p className="text-gray-500">
                        This feature is coming soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Route>
            </Switch>
          </div>
        </main>
      </div>
      
      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full shadow-lg"
          onClick={() => window.location.href = "/persons/new"}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
