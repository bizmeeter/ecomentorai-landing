import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AdminPackages() {
  const [plans, setPlans] = useState([]);
  const [modulesList, setModulesList] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingModules, setEditingModules] = useState({});

  // Load plans and modules from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: plansData } = await supabase.from("plans").select("*");
      const { data: modulesData } = await supabase.from("Modules").select("*");
      setPlans(plansData || []);
      setModulesList(modulesData?.map((m) => m.name) || []);
    };
    fetchData();
  }, []);

  const handleEdit = (plan) => {
    const initialModules = {};
    (plan.modules || []).forEach((m) => {
      initialModules[m] = true;
    });
    setEditingPlanId(plan.id);
    setEditingModules(initialModules);
  };

  const handleSave = async () => {
    if (!editingPlanId) return;

    const selectedModules = Object.keys(editingModules).filter((key) => editingModules[key]);

    const { error } = await supabase
      .from("plans")
      .update({ modules: selectedModules })
      .eq("id", editingPlanId);

    if (error) {
      console.error("Error updating plan:", error);
      alert("Failed to save changes.");
    } else {
      const updatedPlans = plans.map((plan) =>
        plan.id === editingPlanId ? { ...plan, modules: selectedModules } : plan
      );
      setPlans(updatedPlans);
      setEditingPlanId(null);
      setEditingModules({});
    }
  };

  const handleCancel = () => {
    setEditingPlanId(null);
    setEditingModules({});
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Plan Management</h2>
      <table className="table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Modules</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td className="border px-4 py-2">{plan.id}</td>
              <td className="border px-4 py-2">{plan.name}</td>
              <td className="border px-4 py-2">
                {editingPlanId === plan.id ? (
                  modulesList.length > 0 ? (
                    modulesList.map((module) => (
                      <label key={module} className="block">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={!!editingModules[module]}
                          onChange={(e) =>
                            setEditingModules((prev) => ({
                              ...prev,
                              [module]: e.target.checked,
                            }))
                          }
                        />
                        {module}
                      </label>
                    ))
                  ) : (
                    <span>No modules available</span>
                  )
                ) : (
                  <span>{(plan.modules || []).join(", ")}</span>
                )}
              </td>
              <td className="border px-4 py-2">
                {editingPlanId === plan.id ? (
                  <>
                    <button onClick={handleSave} className="mr-2 bg-green-500 text-white px-2 py-1 rounded">
                      Save
                    </button>
                    <button onClick={handleCancel} className="bg-gray-300 px-2 py-1 rounded">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(plan)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPackages;
