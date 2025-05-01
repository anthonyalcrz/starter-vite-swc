interface SavingsStreakProps {
  currentStreak: number;
  bestStreak: number;
  goalAmount: number;
}

const SavingsStreak: React.FC<SavingsStreakProps> = ({
  currentStreak,
  bestStreak,
  goalAmount,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-2 dark:text-white">
          Your Savings Streak
        </h2>
        {currentStreak > 0 ? (
          <p className="text-gray-600 text-sm dark:text-gray-300">
            You've saved money{" "}
            <span className="font-bold">{currentStreak} weeks in a row</span>!
            🎉
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            Save under your weekly budget to start your streak! 🌟
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Target Weekly Save:{" "}
          <span className="font-bold">${goalAmount.toFixed(2)}</span>
        </p>
      </div>

      {bestStreak > 0 && (
        <div className="mt-6 p-4 rounded-md border-l-4 bg-green-100 border-green-500 shadow-sm">
          <p className="text-sm font-medium text-green-700 dark:text-green-500">
            Best Streak: <span className="text-xl">{bestStreak} weeks</span> 🌟
          </p>
        </div>
      )}
    </div>
  );
};

export default SavingsStreak;
