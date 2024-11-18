import clsx from "clsx";
import Link from "next/link";

interface MobileFooterItemProps {
  active?: Boolean;
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
}

const MobileFooterItem: React.FC<MobileFooterItemProps> = ({
  label,
  href,
  onClick,
  icon: Icon,
  active,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <div onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `group flex gap-x-3 rounded-md p-4 text-sm leading-6 font-semibold text-gray-500 hover:text-teal-500  `,
          active && " text-teal-500"
        )}
      >
        <Icon className="h-8 w-8 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </div>
  );
};

export default MobileFooterItem;
