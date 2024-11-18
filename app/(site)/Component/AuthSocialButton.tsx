import React from "react";
import { IconType } from "react-icons";

interface SocialButtonProps {
  onClick: () => void;
  icon: IconType;
}

const AuthSocialButton: React.FC<SocialButtonProps> = ({
  onClick,
  icon: Icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 ring-1 shadow-sm ring-inset ring-gray-300 hover:bg-gray-900 transition-all  focus:outline-offset-0"
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
