import { useEffect } from "react";
import { useDispatch } from "react-redux";

import MainLayout from "../components/layout/MainLayout";

import ProfileHero from "../components/profile/ProfileHero";
import ProfileStats from "../components/profile/ProfileStats";
import PersonalInfo from "../components/profile/PersonalInfo";
import FitnessGoals from "../components/profile/FitnessGoals";
import FitnessSummary from "../components/profile/FitnessSummary";
import Achievements from "../components/profile/Achievements";
import WeeklyActivity from "../components/profile/WeeklyActivity";
import RecentActivity from "../components/profile/RecentActivity";
import AccountSettings from "../components/profile/AccountSettings";
import ConnectedDevices from "../components/profile/ConnectedDevices";


import {
  fetchLatestProgress,
  fetchProgress,
} from "../store/slices/progressSlice";
import { fetchProfile } from "../store/slices/profileSlice";
import { fetchDashboard } from "../store/slices/dashboardSlice";
import { fetchWorkouts } from "../store/slices/workoutSlice";


function Profile() {


  const dispatch = useDispatch();



  useEffect(()=>{

    dispatch(fetchLatestProgress());
    dispatch(fetchProgress());
    dispatch(fetchProfile());
    dispatch(fetchDashboard());
    dispatch(fetchWorkouts());

  },[dispatch]);



  return (

    <MainLayout>

      <div>


        <div className="mb-6">

          <h1 className="text-4xl font-bold text-slate-900">
            Profile
          </h1>


          <p className="text-slate-500 mt-2">
            Manage your personal information, goals, and fitness insights.
          </p>


        </div>




        <ProfileHero />


        <ProfileStats />



        <div className="grid lg:grid-cols-3 gap-6 mt-6">


          <div className="lg:col-span-1 space-y-6">


            <PersonalInfo />

            <FitnessGoals />

            <ConnectedDevices />


          </div>





          <div className="lg:col-span-2 space-y-6">


            <FitnessSummary />

            <Achievements />

            <WeeklyActivity />

            <RecentActivity />

            <AccountSettings />


          </div>



        </div>


      </div>


    </MainLayout>

  );

}


export default Profile;
