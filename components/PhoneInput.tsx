"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { maskPhone } from "@/lib/phone-mask";

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (formatted: string) => void;
  error?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, error, className, ...rest }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          placeholder="(00) 00000-0000"
          value={value}
          onChange={(e) => onChange(maskPhone(e.target.value))}
          className={
            "w-full rounded-xl bg-white px-6 py-5 text-lg font-medium text-[#1F2937] outline-none transition-all placeholder:text-gray-400 focus:ring-[3px] focus:ring-tim-yellow focus:ring-offset-2 focus:ring-offset-tim-blue-primary " +
            (error ? "ring-2 ring-red-400 " : "") +
            (className ?? "")
          }
          {...rest}
        />
        {error && (
          <p role="alert" className="mt-2 text-[13px] font-medium text-red-100">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
