import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Loader2 } from "lucide-react";
import './AdminDashboard.css'
import LowStockPlantsTable from './LowStockPlantsTable'

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [topSellingPlants, setTopSellingPlants] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [lowStockPlants, setLowStockPlants] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const STATUS_COLORS = {
    'Pending': "#FFBB28",
    'Shipping Out': "#0088FE", 
    'Confirmed': "#00C49F", 
    'Delivered': "#8884d8", 
    '': "#FF8042" 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://greencart-backend-z9tq.onrender.com/api/admin/dashboard-summary");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Dashboard API response:", data);

        const {
          summary = {},
          topSellingPlants = [],
          ordersByStatus = [],
          lowStockPlants = [],
          newUsers = [],
        } = data || {};



        let formattedOrdersByStatus = [];

        if (Array.isArray(ordersByStatus)) {
          formattedOrdersByStatus = ordersByStatus;
        }
        else if (!ordersByStatus || ordersByStatus.length === 0) {
          const statusTypes = ['Pending', 'Shipping Out', 'Confirmed', 'Delivered'];
          formattedOrdersByStatus = statusTypes.map(status => ({
            name: status,
            value: 0
          }));
        }

        console.log("Formatted orderStatusData:", formattedOrdersByStatus);

        setSummary(summary);
        setTopSellingPlants(topSellingPlants);
        setOrdersByStatus(formattedOrdersByStatus);
        setLowStockPlants(lowStockPlants);
        setNewUsers(newUsers);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-lg">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto" style={{ backgroundColor: "#fff" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-white shadow">
          <h2 className="text-xl font-bold mb-4">Top Selling Plants</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingPlants}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plantName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Units Sold" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="d-t">
        <div className="c1">
          <Card className="p-4 bg-white shadow">
            <h2 className="text-xl font-bold mb-4">Orders by Status</h2>
            {ordersByStatus && ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 italic">No order status data available</p>
              </div>
            )}
          </Card>
        </div>
        <LowStockPlantsTable lowStockPlants={lowStockPlants}/> 
      </div>
    </div>
  );

};

export default AdminDashboard;