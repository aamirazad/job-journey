import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateWithEllipsis(inputString: string, maxLength: number) {
  return inputString.length > maxLength
    ? inputString.substring(0, maxLength - 3) + "..."
    : inputString;
}
