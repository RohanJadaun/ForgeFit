import { useSelector } from "react-redux";


function FitnessSummary(){


  const {
    latestProgress
  } = useSelector(
    (state)=>state.progress
  );



  const data = [


    {
      label:"Weight",
      value:
        latestProgress?.weight
        ? `${latestProgress.weight} kg`
        : "--"
    },


    {
      label:"Body Fat",
      value:
        latestProgress?.bodyFat
        ? `${latestProgress.bodyFat}%`
        : "--"
    },


    {
      label:"Muscle Mass",
      value:
        latestProgress?.muscleMass
        ? `${latestProgress.muscleMass} kg`
        : "--"
    },


    {
      label:"BMI",
      value:
        latestProgress?.bmi || "--"
    },


    {
      label:"Fitness Score",
      value:
        latestProgress?.fitnessScore || "--"
    }


  ];



  return (

    <div className="bg-white border border-slate-200 rounded-[28px] shadow-sm p-6">


      <h2 className="text-xl font-semibold">
        Fitness Summary
      </h2>


      <p className="text-sm text-slate-500 mt-1 mb-5">
        Latest body measurements and fitness metrics.
      </p>



      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">


        {
          data.map((item)=>(


            <div
              key={item.label}
              className="bg-slate-50 rounded-2xl p-4"
            >


              <p className="text-xs text-slate-500">
                {item.label}
              </p>


              <p className="text-xl font-bold text-slate-900 mt-2">
                {item.value}
              </p>


            </div>


          ))
        }


      </div>


    </div>

  );

}


export default FitnessSummary;