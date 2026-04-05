import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM dd, yyyy')
  } catch {
    return dateString
  }
}

export function formatDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM dd')
  } catch {
    return dateString
  }
}
