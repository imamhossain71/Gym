import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind class merge helper (used by shadcn/ui components). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------ */
/*  BMI calculation                                                    */
/* ------------------------------------------------------------------ */

/**
 * Calculate BMI from weight (kg) and height (cm).
 * @returns {{ bmi: number, category: string }}
 */
export function calculateBMI(weightKg, heightCm) {
  const w = Number(weightKg);
  const h = Number(heightCm);
  if (!w || !h) return { bmi: 0, category: "Unknown" };

  const heightM = h / 100;
  const bmi = Number((w / (heightM * heightM)).toFixed(1));
  return { bmi, category: bmiCategory(bmi) };
}

export function bmiCategory(bmi) {
  if (bmi <= 0) return "Unknown";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Estimate daily calorie target using the Mifflin-St Jeor equation,
 * adjusted for the member's fitness goal.
 */
export function estimateCalories({ weightKg, heightCm, age, gender, goal }) {
  const w = Number(weightKg);
  const h = Number(heightCm);
  const a = Number(age);
  if (!w || !h || !a) return 2000;

  // Basal Metabolic Rate (sedentary -> lightly active baseline)
  const base = 10 * w + 6.25 * h - 5 * a;
  const bmr = gender === "female" ? base - 161 : base + 5;
  const maintenance = Math.round(bmr * 1.4); // light activity factor

  switch (goal) {
    case "Weight Loss":
      return maintenance - 500;
    case "Muscle Gain":
      return maintenance + 350;
    default:
      return maintenance;
  }
}

/**
 * Auto-generate a diet plan from BMI category + goal.
 * Trainers can later override any field.
 * @returns {{ breakfast, lunch, dinner, snacks, water, calories }}
 */
export function generateDietPlan({ category, goal = "Maintenance", calories }) {
  const target = calories || 2000;

  const templates = {
    "Weight Loss": {
      breakfast:
        "Oats with skimmed milk, 2 egg whites, 1 apple, green tea (no sugar)",
      lunch:
        "Grilled chicken breast (150g), brown rice (1 cup), mixed salad, lentil soup",
      dinner:
        "Steamed fish or tofu (150g), sautéed vegetables, small bowl of soup",
      snacks: "Handful of almonds, 1 banana, low-fat yogurt",
      water: "3.5 - 4 litres / day",
    },
    "Muscle Gain": {
      breakfast:
        "4 whole eggs, 2 slices whole-grain toast, peanut butter, banana, full-fat milk",
      lunch:
        "Chicken/beef (200g), white rice (1.5 cups), beans, avocado, vegetables",
      dinner:
        "Salmon or chicken (200g), sweet potato, quinoa, broccoli",
      snacks: "Whey protein shake, mixed nuts, cottage cheese, boiled eggs",
      water: "4 - 4.5 litres / day",
    },
    Maintenance: {
      breakfast: "2 eggs, whole-grain toast, fruit bowl, milk or green tea",
      lunch: "Chicken or fish (150g), rice or roti, dal, vegetables, salad",
      dinner: "Grilled protein (150g), vegetables, small portion of carbs",
      snacks: "Yogurt, seasonal fruit, handful of nuts",
      water: "3 - 3.5 litres / day",
    },
  };

  const plan = templates[goal] || templates.Maintenance;

  // Light category-based nudge appended as guidance.
  let note = "";
  if (category === "Underweight")
    note = " (Add an extra protein-rich snack and a glass of milk before bed.)";
  if (category === "Obese")
    note = " (Prioritise low-GI carbs and avoid fried/sugary foods entirely.)";

  return {
    breakfast: plan.breakfast + note,
    lunch: plan.lunch,
    dinner: plan.dinner,
    snacks: plan.snacks,
    water: plan.water,
    calories: target,
  };
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

export function formatCurrency(amount, currency = "BDT") {
  const n = Number(amount) || 0;
  if (currency === "BDT") return `৳${n.toLocaleString("en-BD")}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}

export function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Add N months to a date — used for membership expiry calc. */
export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + Number(months));
  return d;
}

export const PLAN_DURATIONS = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  GYM_ADMIN: "gym_admin",
  TRAINER: "trainer",
  MEMBER: "member",
};
