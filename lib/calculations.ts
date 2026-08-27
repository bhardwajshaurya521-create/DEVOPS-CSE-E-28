export type CalcInput = {
  pocketMoney: number;
  reserved: number;
  spent: number;
  daysRemaining: number;
};

export function calculateMoney({ pocketMoney, reserved, spent, daysRemaining }: CalcInput) {
  const available = Math.max(0, pocketMoney - reserved - spent);
  const safeDaily = daysRemaining > 0 ? available / daysRemaining : available;
  return { available, safeDaily };
}

export function budgetStatus(spent: number, limit: number) {
  if (limit <= 0) return { percent: 0, level: "none" as const };
  const percent = (spent / limit) * 100;
  if (percent >= 100) return { percent, level: "exceeded" as const };
  if (percent >= 90) return { percent, level: "danger" as const };
  if (percent >= 70) return { percent, level: "warning" as const };
  return { percent, level: "safe" as const };
}
