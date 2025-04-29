import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SavvyMascot from "../savvymascot";
import { AVATAR_OPTIONS } from "../constants";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileStepProps {
  data: {
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthDate?: Date;
    avatar?: string;
  };
  onDataChange: (updatedData: any) => void;
  onNext: () => void;
  onBack: () => void;
  contentVariants: any;
}

const ProfileStep: React.FC<ProfileStepProps> = ({
  data,
  onDataChange,
  contentVariants,
}) => {
  const [birthInput, setBirthInput] = useState("");

  useEffect(() => {
    if (data.birthDate) {
      setBirthInput(format(data.birthDate, "MM/dd/yyyy"));
    }
  }, [data.birthDate]);

  const handleBirthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    let formatted = "";

    if (raw.length > 0) formatted += raw.slice(0, 2);
    if (raw.length > 2) formatted += "/" + raw.slice(2, 4);
    if (raw.length > 4) formatted += "/" + raw.slice(4, 8);

    setBirthInput(formatted);

    if (raw.length === 8) {
      const month = parseInt(raw.slice(0, 2));
      const day = parseInt(raw.slice(2, 4));
      const year = parseInt(raw.slice(4, 8));
      const date = new Date(year, month - 1, day);

      if (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date < new Date() &&
        date > new Date("1900-01-01")
      ) {
        onDataChange({ ...data, birthDate: date });
      }
    }
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center"
    >
      <div className="mb-6">
        <SavvyMascot
          imageUrl="/savvy/savvy_love.png"
          emotion="thinking"
          message="Let's create your profile! This helps personalize your experience."
          size="medium"
          animationType="pulse"
        />
      </div>

      <div className="flex flex-col space-y-6 w-full max-w-md">
        {/* Avatar Selection */}
        <div className="space-y-4">
          <Label>Choose your avatar</Label>
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_OPTIONS.map((avatarUrl, index) => (
              <div
                key={index}
                className={cn(
                  "cursor-pointer p-1 rounded-md transition-all",
                  data.avatar === avatarUrl
                    ? "ring-2 ring-primary bg-primary/10"
                    : "hover:bg-muted",
                )}
                onClick={() => onDataChange({ ...data, avatar: avatarUrl })}
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
                  <AvatarFallback>🐨</AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={data.firstName || ""}
              onChange={(e) =>
                onDataChange({ ...data, firstName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={data.lastName || ""}
              onChange={(e) =>
                onDataChange({ ...data, lastName: e.target.value })
              }
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={data.gender || ""}
            onValueChange={(value) => onDataChange({ ...data, gender: value })}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">
                Prefer not to say
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <div className="relative">
            <Input
              id="birthDate"
              placeholder="MM/DD/YYYY"
              value={birthInput}
              onChange={handleBirthInputChange}
              onFocus={(e) => e.target.select()}
            />
            <CalendarIcon
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer hover:opacity-100 hover:text-primary transition-colors"
              onClick={() =>
                document.getElementById("calendar-popover-trigger")?.click()
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileStep;
