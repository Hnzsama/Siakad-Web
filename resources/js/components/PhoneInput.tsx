import React, { useState, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    label?: string;
    error?: string; // Add error prop to handle form-level errors
    disabled?: boolean
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    placeholder = "Masukkan nomor telepon",
    className = "",
    label = "Nomor Telepon",
    error: formError,
    disabled = false
}) => {
    const [localError, setLocalError] = useState<string>("");
    const inputId = "phone-input";

    const formatPhoneNumber = (value: string): string => {
        let cleaned = value.replace(/\D/g, '');

        if (cleaned.startsWith('62')) {
            cleaned = '0' + cleaned.substring(2);
        }

        cleaned = cleaned.substring(0, 13);

        return cleaned;
    };

    const validatePhoneNumber = (value: string): string => {
        if (!value) return "Nomor telepon wajib diisi";

        const cleaned = value.replace(/\D/g, '');

        if (cleaned.length < 10) return "Nomor telepon minimal 10 digit";
        if (cleaned.length > 13) return "Nomor telepon maksimal 13 digit";
        if (!cleaned.startsWith('0')) return "Nomor telepon harus dimulai dengan 0";

        const validPrefixes = ['08', '021', '022', '024'];
        if (!validPrefixes.some(prefix => cleaned.startsWith(prefix))) {
            return "Format nomor telepon tidak valid";
        }

        return "";
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        const validationError = validatePhoneNumber(formattedValue);
        setLocalError(validationError);
        onChange(formattedValue);
    };

    // Display either form-level error or local validation error
    const displayError = formError || localError;

    return (
        <div className="space-y-2">
            <Label htmlFor={inputId}>{label}</Label>
            <Input
                id={inputId}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                type="tel"
                inputMode="numeric"
                className={`${className} ${displayError ? "ring-destructive" : ""}`}
                disabled={disabled}
            />
            {displayError && (
                <span className="text-sm text-destructive">{displayError}</span>
            )}
        </div>
    );
};

export default PhoneInput;
