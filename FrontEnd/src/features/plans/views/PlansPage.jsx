import { useEffect, useState } from "react";
import planApi from "../api/planApi";
import PlanList from "./PlanList";
import { Link } from "react-router-dom";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const fetchPlans = async () => {
    try {
      const plans = await planApi.getPublicLearningPlans();
      setPlans(plans.content);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);
  return (
    <div>
    <div className="w-full flex justify-end">
    <Link to={"/create-plan"} class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Plan
      </Link>
    </div>
      <PlanList plans={plans} />
    </div>
  );
};

export default PlansPage;
