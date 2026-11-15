import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import ProgressHero from "../components/progress/ProgressHero";
import WeightProgressChart from "../components/progress/WeightProgressChart";
import FitnessScore from "../components/progress/FitnessScore";
import BodyMeasurements from "../components/progress/BodyMeasurements";
import WorkoutConsistency from "../components/progress/WorkoutConsistency";
import PersonalRecords from "../components/progress/PersonalRecords";
import MonthlySummary from "../components/progress/MonthlySummary";
import LogProgressModal from "../components/progress/LogProgressModal";

import {
  fetchProgress,
  fetchLatestProgress,
  createProgress,
} from "../store/slices/progressSlice";
import { fetchWorkouts } from "../store/slices/workoutSlice";

import { motion } from "framer-motion";


function Progress() {

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const logModalOpen = manualModalOpen || searchParams.get("log") === "1";

  const {
    progress,
    latestProgress,
    loading,
    error,
  } = useSelector(
    (state) => state.progress
  );
  const { workouts } = useSelector((state) => state.workout);


  useEffect(() => {

    dispatch(fetchProgress());
    dispatch(fetchLatestProgress());
    dispatch(fetchWorkouts());

  }, [dispatch]);



  return (

    <MainLayout>

      <div className="space-y-6">


        <div className="mb-2">

          <h1 className="text-3xl font-bold text-slate-900">
            Progress
          </h1>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <p className="text-slate-500 text-sm mt-1">
              Track your fitness journey, achievements and growth.
            </p>
            <button type="button" id="log-measurement" onClick={() => setManualModalOpen(true)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Log measurement</button>
          </div>
          {loading && <p className="text-sm text-slate-500" role="status">Loading progress…</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

        </div>



        <ProgressHero
          latestProgress={latestProgress}
          progress={progress}
        />



        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-12 gap-4"
        >

          <div className="lg:col-span-8">
            <WeightProgressChart
              progress={progress}
            />
          </div>


          <div className="lg:col-span-4">
            <FitnessScore
              latestProgress={latestProgress}
            />
          </div>


        </motion.div>



        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.3 }}
          className="grid lg:grid-cols-2 gap-4"
        >

          <BodyMeasurements
            latestProgress={latestProgress}
          />

          <WorkoutConsistency workouts={workouts} />

        </motion.div>



        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.4 }}
          className="grid lg:grid-cols-2 gap-4"
        >

          <PersonalRecords progress={progress} workouts={workouts} />

          <MonthlySummary progress={progress} workouts={workouts} />

        </motion.div>


      </div>

      {logModalOpen && <LogProgressModal onClose={() => { setManualModalOpen(false); if (searchParams.has("log")) { const next = new URLSearchParams(searchParams); next.delete("log"); setSearchParams(next, { replace: true }); } }} onSave={async (data) => { await dispatch(createProgress(data)).unwrap(); await Promise.all([dispatch(fetchProgress()), dispatch(fetchLatestProgress())]); setManualModalOpen(false); if (searchParams.has("log")) { const next = new URLSearchParams(searchParams); next.delete("log"); setSearchParams(next, { replace: true }); } }} />}

    </MainLayout>

  );
}


export default Progress;
