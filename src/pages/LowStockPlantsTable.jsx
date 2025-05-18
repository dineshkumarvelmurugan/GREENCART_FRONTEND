import { useState } from "react";
import Pagination from "./Pagination"; // Adjust path if needed
import Card from "../components/ui/Card";

const LowStockPlantsTable = ({ lowStockPlants }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 5;

  const totalPages = Math.ceil((lowStockPlants?.length || 0) / plantsPerPage);
  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = lowStockPlants?.slice(indexOfFirstPlant, indexOfLastPlant);

  return (
    <div className="c2">
      <Card className="p-4 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Low Stock Plants</h2>
        {lowStockPlants && lowStockPlants.length > 0 ? (
          <>
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
                  {currentPlants.map((plant, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-2 px-4">{plant.name}</td>
                      <td className="py-2 px-4 text-red-600 font-semibold">{plant.stock}</td>
                      <td className="py-2 px-4">${plant.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <p className="text-gray-500 italic">No low stock plants</p>
        )}
      </Card>
    </div>
  );
};

export default LowStockPlantsTable;
