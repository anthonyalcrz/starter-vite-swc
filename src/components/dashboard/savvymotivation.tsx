import { useState, useEffect } from "react";

interface SavvyMotivationProps {
  defaultMessage?: string;
  defaultImage?: string;
}

export default function SavvyMotivation({
  defaultMessage = "Keep track of your spending to reach your financial goals!",
  defaultImage = "/savvy/savvy_default.png",
}: SavvyMotivationProps) {
  const [message, setMessage] = useState(defaultMessage);
  const [image, setImage] = useState(defaultImage);

  // Array of motivational messages and corresponding images
  const motivationalContent = [
    {
      message: "Keep track of your spending to reach your financial goals!",
      image: "/savvy/savvy_default.png",
    },
    {
      message: "Small savings today lead to big rewards tomorrow!",
      image: "/savvy/savvy_excited.png",
    },
    {
      message: "You're doing great! Keep up the good work!",
      image: "/savvy/savvy_excited_jumping.png",
    },
    {
      message: "Every dollar saved is a step toward financial freedom!",
      image: "/savvy/savvy_carrying_coin.png",
    },
    {
      message: "Planning your finances is planning for success!",
      image: "/savvy/savvy_calendar.png",
    },
    {
      message: "Consistency is key to building wealth!",
      image: "/savvy/savvy_wearing_cape.png",
    },
  ];

  // Function to get a random message
  const getRandomContent = () => {
    const randomIndex = Math.floor(Math.random() * motivationalContent.length);
    return motivationalContent[randomIndex];
  };

  // Set random tip on component mount
  useEffect(() => {
    const newContent = getRandomContent();
    setMessage(newContent.message);
    setImage(newContent.image);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full transition-all duration-500 ease-in-out hover:scale-105">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">Savvy Says</h2>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <img
          src={image}
          alt="Savvy the Koala"
          className="h-24 w-24 object-contain transition-opacity duration-500 opacity-80 hover:opacity-100"
          aria-label="Savvy the Koala Motivational Image"
        />
        <div className="flex-1">
          <p className="italic text-gray-700 dark:text-gray-300">"{message}"</p>
        </div>
      </div>
    </div>
  );
}
