"use client";

interface DateInputProps {
    name: string;
    label: string;
    defaultValue?: string;
}

export function DateInput({ name, label, defaultValue }: DateInputProps) {
    return (
        <div className="min-w-[140px] max-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <input
                type="date"
                name={name}
                defaultValue={defaultValue}
                onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            />
        </div>
    );
}
