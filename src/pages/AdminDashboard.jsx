import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [topSellingPlants, setTopSellingPlants] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [lowStockPlants, setLowStockPlants] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const STATUS_COLORS = {
    'Pending': "#FFBB28", // Yellow
    'Shipping Out': "#0088FE", // Blue
    'Confirmed': "#00C49F", // Green
    'Delivered': "#8884d8", // Purple
    '': "#FF8042" // Orange for any null/undefined values
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

        // Format revenue as currency
        if (summary["Total Revenue"]) {
          summary["Total Revenue"] = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(summary["Total Revenue"]);
        }

        // Format order status data for the pie chart
        let formattedOrdersByStatus = [];
        
        // Handle array format from backend
        if (Array.isArray(ordersByStatus)) {
          formattedOrdersByStatus = ordersByStatus;
        } 
        // If no data or empty array, create placeholders
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
  <div className="p-6 max-w-7xl mx-auto">
  

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Quadrant: Summary Cards */}
      {/* <Card className="p-4 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(summary).map(([key, value]) => (
            <Card key={key} className="bg-green-50 hover:shadow-lg transition-shadow">
              <CardContent className="text-center p-4">
                <p className="text-md font-semibold text-gray-600">{key}</p>
                <p className="text-2xl font-bold text-green-700">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Card> */}

      {/* Second Quadrant: Top Selling Products */}
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

      {/* Third Quadrant: Orders by Status */}
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

      {/* Fourth Quadrant: Low Stock Plants */}
      <Card className="p-4 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Low Stock Plants</h2>
        {lowStockPlants && lowStockPlants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-green-50">
                  <th className="py-2 px-4 text-left">Plant Name</th>
                  <th className="py-2 px-4 text-left">Stock</th>
                  <th className="py-2 px-4 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStockPlants.map((plant, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-2 px-4">{plant.name}</td>
                    <td className="py-2 px-4 text-red-600 font-semibold">{plant.stock}</td>
                    <td className="py-2 px-4">${plant.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No low stock plants</p>
        )}
      </Card>
    </div>
  </div>
);

};

export default AdminDashboard;