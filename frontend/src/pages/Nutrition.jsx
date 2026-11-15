import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MainLayout from "../components/layout/MainLayout";

import {
  fetchNutrition,
  fetchTodayNutrition,
  createMeal,
  editMeal,
} from "../store/slices/nutritionSlice";

import NutritionHero from "../components/nutrition/NutritionHero";
import MealList from "../components/nutrition/MealList";
import MacroBreakdown from "../components/nutrition/MacroBreakdown";
import NutritionTips from "../components/nutrition/NutritionTips";
import AddFoodModal from "../components/nutrition/AddFoodModal";

import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Cookie,
  Dumbbell,
} from "lucide-react";


function Nutrition() {

  const dispatch = useDispatch();
  const [foodModalOpen, setFoodModalOpen] = useState(false);

  const {
    todayNutrition,
    error,
  } = useSelector(
    (state) => state.nutrition
  );

  const saveTodayNutrition = async (nextNutrition) => {
    if (todayNutrition?._id) {
      await dispatch(editMeal({ id: todayNutrition._id, data: nextNutrition })).unwrap();
    } else {
      await dispatch(createMeal(nextNutrition)).unwrap();
    }
    await Promise.all([dispatch(fetchTodayNutrition()), dispatch(fetchNutrition())]);
  };

  const saveFood = async (food) => {
    await saveTodayNutrition({
      date: todayNutrition?.date || new Date().toISOString(),
      calories: (todayNutrition?.calories || 0) + food.calories,
      protein: (todayNutrition?.protein || 0) + food.protein,
      carbs: (todayNutrition?.carbs || 0) + food.carbs,
      fat: (todayNutrition?.fat || 0) + food.fat,
      water: todayNutrition?.water || 0,
      meals: [...(todayNutrition?.meals || []), food],
    });
  };

  const addWater = async (amount) => {
    await saveTodayNutrition({
      date: todayNutrition?.date || new Date().toISOString(),
      calories: todayNutrition?.calories || 0,
      protein: todayNutrition?.protein || 0,
      carbs: todayNutrition?.carbs || 0,
      fat: todayNutrition?.fat || 0,
      water: Math.round(((todayNutrition?.water || 0) + amount) * 100) / 100,
      meals: todayNutrition?.meals || [],
    });
  };


  useEffect(() => {
    dispatch(fetchNutrition());
    dispatch(fetchTodayNutrition());
  }, [dispatch]);



  const stats = [
    {
      title: "Calories",
      value: `${todayNutrition?.calories || 0} kcal`,
      icon: Flame,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Protein",
      value: `${todayNutrition?.protein || 0} g`,
      icon: Beef,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Carbs",
      value: `${todayNutrition?.carbs || 0} g`,
      icon: Wheat,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Fat",
      value: `${todayNutrition?.fat || 0} g`,
      icon: Cookie,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Water",
      value: `${todayNutrition?.water || 0} L`,
      icon: Droplets,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Meals",
      value: todayNutrition?.meals?.length || 0,
      icon: Dumbbell,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];



  const foodLog =
    todayNutrition?.meals?.map((meal) => ({
      name: meal.foodName,
      time: meal.mealType,
      protein: `${meal.protein}g`,
      carbs: `${meal.carbs}g`,
      fat: `${meal.fat}g`,
      calories: meal.calories,
    })) || [];



  return (

    <MainLayout>

      <div>

        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          Nutrition
        </h1>


        <NutritionHero calories={todayNutrition?.calories || 0} onAddFood={() => setFoodModalOpen(true)} />

        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}


        <NutritionTips
          nutritionStats={stats}
        />


        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">


          <MealList
            foodLog={foodLog}
          />


          <MacroBreakdown nutrition={todayNutrition} onAddFood={() => setFoodModalOpen(true)} onAddWater={addWater} />


        </div>


      </div>

      {foodModalOpen && <AddFoodModal onClose={() => setFoodModalOpen(false)} onSave={saveFood} />}

    </MainLayout>

  );
}


export default Nutrition;
