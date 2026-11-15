import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


function RecentWorkoutList() {

  const { workouts } = useSelector(
    (state) => state.workout
  );

  return (

    <div className="p-4 bg-white rounded-xl shadow">

      <h2 className="font-semibold mb-3">
        Recent Workouts
      </h2>


      <div className="space-y-2">

        {workouts?.slice(0,5).map((workout)=>(
          <Link key={workout._id} to={`/workouts/${workout._id}`} className="block border-b border-slate-100 pb-2 text-sm cursor-pointer hover:text-blue-600">
            <span className="font-medium">{workout.title}</span>
            <span className="mt-1 block text-xs text-slate-500">{workout.createdAt ? new Date(workout.createdAt).toLocaleDateString() : "Workout session"} · {workout.duration} min · {workout.exercises?.length || 0} exercises</span>
          </Link>
        ))}
        {!workouts?.length && <p className="text-sm text-slate-500">Your logged sessions will appear here.</p>}

      </div>

    </div>

  );
}


export default RecentWorkoutList;
