import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'SGD', decimalPlaces: number = 2): string {
    return new Intl.NumberFormat('en-SG', {
        style: 'currency',
        currency: currency === 'USD' ? 'SGD' : currency,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(amount);
}
