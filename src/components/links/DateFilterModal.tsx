'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (startDate: Date | null, endDate: Date | null, label?: string) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  initialPreset?: string | null;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const formatDateInput = (date: Date | null): string => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isDayInRange = (dayDate: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const dayTime = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate()).getTime();
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return dayTime >= startTime && dayTime <= endTime;
};

const formatBitlyDateLabel = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return '';
  const startMonth = start.toLocaleString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleString('en-US', { month: 'short' });
  const endDay = end.getDate();

  if (isSameDay(start, end)) {
    return `${startMonth} ${startDay}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
};

export const DateFilterModal: React.FC<DateFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStartDate,
  initialEndDate,
  initialPreset,
}) => {
  const [mounted, setMounted] = useState(false);

  // Active view date for month/year header
  const [viewDate, setViewDate] = useState<Date>(() => initialStartDate || new Date());
  
  // Selection range state
  const [startDate, setStartDate] = useState<Date | null>(() => initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(() => initialEndDate || null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(() => initialPreset || null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialStartDate) setStartDate(initialStartDate);
      if (initialEndDate) setEndDate(initialEndDate);
      if (initialPreset) setSelectedPreset(initialPreset);
      if (initialStartDate) setViewDate(new Date(initialStartDate.getFullYear(), initialStartDate.getMonth(), 1));
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialStartDate, initialEndDate, initialPreset]);

  // Compute Calendar Days Grid for viewDate
  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon, etc.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{ date: Date; isCurrentMonth: boolean; dayNumber: number }> = [];

    // Trailing days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      cells.push({ date: prevDate, isCurrentMonth: false, dayNumber: dayNum });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currDate = new Date(year, month, day);
      cells.push({ date: currDate, isCurrentMonth: true, dayNumber: day });
    }

    // Leading days for next month to complete 35 or 42 cells
    const remainingCells = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day);
      cells.push({ date: nextDate, isCurrentMonth: false, dayNumber: day });
    }

    return cells;
  }, [viewDate]);

  const todayEnd = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  }, []);

  const isFutureMonth = useMemo(() => {
    const now = new Date();
    return (
      viewDate.getFullYear() > now.getFullYear() ||
      (viewDate.getFullYear() === now.getFullYear() && viewDate.getMonth() >= now.getMonth())
    );
  }, [viewDate]);

  if (!isOpen || !mounted) return null;

  const presets = [
    'Last hour',
    'Today',
    'Last 7 days',
    'Last 30 days',
    'Last 60 days',
    'Last 90 days',
  ];

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Preset button handler
  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (preset === 'Last hour') {
      start = new Date(now.getTime() - 60 * 60 * 1000);
      end = new Date(now.getTime());
    } else if (preset === 'Today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (preset === 'Last 7 days') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
    } else if (preset === 'Last 30 days') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0);
    } else if (preset === 'Last 60 days') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 59, 0, 0, 0, 0);
    } else if (preset === 'Last 90 days') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 89, 0, 0, 0, 0);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }

    setStartDate(start);
    setEndDate(end);
    setViewDate(new Date(start.getFullYear(), start.getMonth(), 1));
  };

  // Calendar Day Click Handler (Range picker)
  const handleDayClick = (dayDate: Date) => {
    setSelectedPreset(null);

    if (!startDate || (startDate && endDate && !isSameDay(startDate, endDate))) {
      const newStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0);
      const newEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59, 999);
      setStartDate(newStart);
      setEndDate(newEnd);
    } else if (startDate && isSameDay(startDate, endDate)) {
      if (dayDate < startDate) {
        const newStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0);
        const newEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59, 999);
        setStartDate(newStart);
        setEndDate(newEnd);
      } else {
        const newEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59, 999);
        setEndDate(newEnd);
      }
    }
  };

  const handleApply = () => {
    if (onApply) {
      const label = startDate && endDate ? formatBitlyDateLabel(startDate, endDate) : undefined;
      onApply(startDate, endDate, label);
    }
    onClose();
  };

  const currentMonthYearHeader = `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto select-none">
      {/* Backdrop (No blur) */}
      <div
        className="fixed inset-0 bg-slate-900/60 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-4.5 sm:p-6 shadow-2xl border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 dark:border-slate-800 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#273144] dark:text-slate-100 truncate">
            Filter by created date
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 sm:space-y-5">
          {/* Start and End Date Inputs */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <input
              type="text"
              readOnly
              value={formatDateInput(startDate)}
              placeholder="Start Date"
              aria-label="Start date"
              className="h-9 sm:h-10 w-full rounded-md border border-slate-200 bg-slate-100/70 px-2 sm:px-3.5 text-xs sm:text-sm font-semibold text-[#273144] text-center dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            />
            <input
              type="text"
              readOnly
              value={formatDateInput(endDate)}
              placeholder="End Date"
              aria-label="End date"
              className="h-9 sm:h-10 w-full rounded-md border border-slate-200 bg-slate-100/70 px-2 sm:px-3.5 text-xs sm:text-sm font-semibold text-[#273144] text-center dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Calendar View */}
          <div className="space-y-2.5 sm:space-y-3 pt-1">
            {/* Calendar Month Nav */}
            <div className="flex items-center justify-between px-1 sm:px-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <span className="text-xs sm:text-sm font-bold text-[#273144] dark:text-slate-100">
                {currentMonthYearHeader}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={isFutureMonth}
                aria-label="Next month"
                className={`p-1 rounded-md transition-colors ${
                  isFutureMonth
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                }`}
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Calendar Days Table */}
            <div className="space-y-1.5 sm:space-y-2">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-semibold text-[#526281] dark:text-slate-400">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day Grid Cells */}
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-xs sm:text-sm">
                {calendarCells.map((cell, idx) => {
                  const isStart = isSameDay(cell.date, startDate);
                  const isEnd = isSameDay(cell.date, endDate);
                  const inRange = isDayInRange(cell.date, startDate, endDate);

                  const cellTime = new Date(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate(), 0, 0, 0, 0).getTime();
                  const isFuture = cellTime > todayEnd;

                  if (isFuture) {
                    return (
                      <span
                        key={idx}
                        className="py-1 sm:py-1.5 text-xs sm:text-sm text-slate-300 dark:text-slate-700 pointer-events-none font-normal"
                      >
                        {cell.dayNumber}
                      </span>
                    );
                  }

                  if (!cell.isCurrentMonth) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDayClick(cell.date)}
                        className={`py-1 sm:py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          inRange
                            ? 'bg-[#e8eefd] text-slate-400 dark:bg-[#2a5bd7]/20 dark:text-slate-500'
                            : 'text-slate-300 dark:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {cell.dayNumber}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDayClick(cell.date)}
                      className={`py-1 sm:py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        isStart || isEnd
                          ? 'bg-[#2a5bd7] text-white font-bold rounded-lg shadow-2xs'
                          : inRange
                          ? 'bg-[#e8eefd] text-[#273144] dark:bg-[#2a5bd7]/30 dark:text-blue-100 font-semibold'
                          : 'text-[#273144] hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 rounded-md'
                      }`}
                    >
                      {cell.dayNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preset Buttons Panel */}
          <div className="rounded-xl bg-[#f4f6f8] p-2.5 sm:p-3.5 dark:bg-slate-800/60 flex flex-wrap gap-1.5 sm:gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer ${
                  selectedPreset === preset
                    ? 'border-2 border-[#2a5bd7] text-[#2a5bd7] bg-white font-bold dark:bg-slate-900 dark:border-blue-500 dark:text-blue-400'
                    : 'border border-slate-200 bg-white text-[#273144] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="h-9 sm:h-10 px-4 sm:px-5 flex-1 sm:flex-initial rounded-lg sm:rounded-md border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-9 sm:h-10 px-5 sm:px-6 flex-1 sm:flex-initial rounded-lg sm:rounded-md bg-[#2a5bd7] text-white text-xs sm:text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer text-center"
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
