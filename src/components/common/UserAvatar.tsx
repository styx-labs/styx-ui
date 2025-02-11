import { useState } from "react";
import { User } from "firebase/auth";

interface UserAvatarProps {
  user: User;
  className?: string;
}

export function UserAvatar({ user, className = "" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  if (user?.photoURL && !imageError) {
    return (
      <img
        src={user.photoURL}
        alt="Profile"
        className={`w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      className={`w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-600 transition-colors ${className}`}
    >
      {user?.displayName?.[0]?.toUpperCase() ||
        user?.email?.[0]?.toUpperCase() ||
        "?"}
    </div>
  );
}
