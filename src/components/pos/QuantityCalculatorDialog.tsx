"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Delete, Check, RotateCcw } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  productName: string;
  initialQuantity: number;
  onConfirm: (quantity: number) => void;
}

export default function QuantityCalculatorDialog({
  open,
  onClose,
  productName,
  initialQuantity,
  onConfirm,
}: Props) {
  const [value, setValue] = useState(initialQuantity.toString());

  // Reset value when dialog opens with new item
  useEffect(() => {
    if (open) {
      setValue(initialQuantity.toString());
    }
  }, [open, initialQuantity]);

  // Support physical keyboard entries
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        setValue((prev) => {
          // If the prev value is "0" or matches the initial quantity and is clicked first, replace it
          if (prev === "0" || prev === initialQuantity.toString()) {
            return e.key;
          }
          return prev + e.key;
        });
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setValue((prev) => {
          if (prev.length <= 1) return "0";
          return prev.slice(0, -1);
        });
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, value, initialQuantity]);

  const handleKeyPress = (num: string) => {
    setValue((prev) => {
      if (prev === "0" || prev === initialQuantity.toString()) return num;
      return prev + num;
    });
  };

  const handleClear = () => {
    setValue("0");
  };

  const handleBackspace = () => {
    setValue((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const handlePreset = (addAmount: number) => {
    setValue((prev) => {
      const current = parseInt(prev) || 0;
      return Math.max(0, current + addAmount).toString();
    });
  };

  const handleConfirm = () => {
    const parsed = parseInt(value);
    onConfirm(isNaN(parsed) || parsed < 0 ? 0 : parsed);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[340px] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 gap-4">
        
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Set Quantity
          </DialogTitle>
          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 truncate max-w-[280px]">
            {productName}
          </p>
        </DialogHeader>

        {/* Digital calculator display */}
        <div className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase select-none">
            QTY
          </span>
          <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50 tracking-wide">
            {value}
          </span>
        </div>

        {/* Preset additions */}
        <div className="grid grid-cols-3 gap-1.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => handlePreset(1)}
            className="h-8 text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            +1
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handlePreset(5)}
            className="h-8 text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            +5
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handlePreset(10)}
            className="h-8 text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            +10
          </Button>
        </div>

        {/* Grid Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((num) => (
            <Button
              key={num}
              type="button"
              variant="ghost"
              onClick={() => handleKeyPress(num)}
              className="h-11 w-full text-base font-extrabold border border-zinc-150/60 dark:border-zinc-800/40 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all shadow-xs"
            >
              {num}
            </Button>
          ))}

          {/* Special Buttons */}
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="h-11 w-full text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border border-zinc-150/60 dark:border-zinc-800/40 bg-red-50/20 dark:bg-red-950/10 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => handleKeyPress("0")}
            className="h-11 w-full text-base font-extrabold border border-zinc-150/60 dark:border-zinc-800/40 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all shadow-xs"
          >
            0
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleBackspace}
            className="h-11 w-full text-xs font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-150/60 dark:border-zinc-800/40 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-xl transition-all shadow-xs"
          >
            <Delete className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-9 text-xs font-bold border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex-1 h-9 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 shadow-sm gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Apply
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
