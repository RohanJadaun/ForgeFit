import { useSelector } from "react-redux";
import { Target } from "lucide-react";


function FitnessGoals(){

  const { profile } = useSelector(
    (state)=>state.profile
  );


  return (

    <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm p-6">


      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl font-semibold">
          Fitness Goals
        </h2>


        <Target
          size={20}
          className="text-blue-600"
        />

      </div>



      <p className="text-sm text-slate-500 mb-4">
        Current fitness objective.
      </p>



      <div className="bg-blue-50 rounded-2xl p-4">


        <p className="text-sm text-slate-500">
          Goal
        </p>


        <h3 className="text-2xl font-bold text-blue-600 mt-1">

          {profile?.fitnessProfile?.goal || profile?.goal || "Not set"}

        </h3>



        <p className="text-sm text-slate-600 mt-2">

          Activity:
          {" "}
          {profile?.activityLevel || profile?.fitnessProfile?.level || "Not set"}

        </p>


      </div>


    </div>

  );

}


export default FitnessGoals;
