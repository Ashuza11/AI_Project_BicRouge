import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonStyles = cva(["transition-colors"], {
    variants: {
        variant: {
            default: ["bg-dashboardSecondary", "hover:bg-dashboardSecondary-hover"],
            ghost: ["hover:bg-gray-100"],
            dark: ["bg-primary", "hover:bg-primary-hover", "text-dashboardSecondary"],
        },
        size: {
            default: [
                "rounded", "p-2",],
            icon:[
                "rounded-full",
                "w-10",
                "h-10",
                "flex",
                "items-center",
                "justify-center",
                "p-2.5",
            ]
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
})

const DashboardButton = ({variant, size, className, ...props}) => {
  return (
    <button 
        {...props} 
        className={twMerge(buttonStyles({ variant, size}),
        className )} 
    />
  )
}

export default DashboardButton;

