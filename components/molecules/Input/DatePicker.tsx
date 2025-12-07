/**
 * DatePicker Component
 * A date input with a calendar modal
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@/theme';
import { Text, Icon, Spacer, Button } from '@/components/atoms';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDate(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month: month - 1, day };
}

// ═══════════════════════════════════════════════════════════════════
// CALENDAR COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}

function Calendar({ selectedDate, onSelectDate, minDate, maxDate }: CalendarProps) {
  const { tokens } = useTheme();

  const initialDate = selectedDate ? parseDate(selectedDate) : {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  };

  const [viewYear, setViewYear] = useState(initialDate.year);
  const [viewMonth, setViewMonth] = useState(initialDate.month);

  const selectedParsed = selectedDate ? parseDate(selectedDate) : null;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isDateDisabled = (day: number): boolean => {
    const dateStr = formatDate(viewYear, viewMonth, day);
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
  };

  const isSelected = (day: number): boolean => {
    if (!selectedParsed) return false;
    return viewYear === selectedParsed.year && viewMonth === selectedParsed.month && day === selectedParsed.day;
  };

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  }, [firstDay, daysInMonth]);

  return (
    <View style={styles.calendar}>
      {/* Header */}
      <View style={styles.calendarHeader}>
        <Pressable style={styles.navButton} onPress={handlePrevMonth}>
          <Icon name="chevron-back" size={24} color="primary" />
        </Pressable>
        <Text variant="h4" weight="semibold">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <Pressable style={styles.navButton} onPress={handleNextMonth}>
          <Icon name="chevron-forward" size={24} color="primary" />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAY_NAMES.map((name) => (
          <View key={name} style={styles.weekdayCell}>
            <Text variant="caption" color="muted" weight="semibold">
              {name}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.daysGrid}>
        {calendarDays.map((day, index) => (
          <View key={index} style={styles.dayCell}>
            {day !== null && (
              <Pressable
                style={[
                  styles.dayButton,
                  isSelected(day) && { backgroundColor: tokens.colors.brand.primary },
                  isToday(day) && !isSelected(day) && { borderColor: tokens.colors.brand.primary, borderWidth: 1 },
                  isDateDisabled(day) && styles.dayDisabled,
                ]}
                onPress={() => !isDateDisabled(day) && onSelectDate(formatDate(viewYear, viewMonth, day))}
                disabled={isDateDisabled(day)}
              >
                <Text
                  variant="body"
                  color={isSelected(day) ? 'inverse' : isDateDisabled(day) ? 'muted' : 'primary'}
                  weight={isToday(day) ? 'bold' : 'regular'}
                >
                  {day}
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  minDate,
  maxDate,
}: DatePickerProps) {
  const { tokens } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = useMemo(() => {
    if (!value) return '';
    const { year, month, day } = parseDate(value);
    return `${MONTH_NAMES[month]} ${day}, ${year}`;
  }, [value]);

  const handleSelect = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <View>
        {label && (
          <>
            <Text variant="label" color="secondary" style={{ marginBottom: 8 }}>
              {label}
            </Text>
          </>
        )}
        <Pressable
          style={[
            styles.trigger,
            {
              backgroundColor: tokens.colors.background.tertiary,
              borderColor: tokens.colors.border.default,
            },
          ]}
          onPress={() => setIsOpen(true)}
        >
          <Icon name="calendar-outline" size={20} color="brand" />
          <Text
            variant="body"
            color={value ? 'primary' : 'muted'}
            style={{ flex: 1 }}
          >
            {displayValue || placeholder}
          </Text>
          <Icon name="chevron-down" size={20} color="muted" />
        </Pressable>
      </View>

      {/* Modal */}
      <Modal
        visible={isOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContainer, { backgroundColor: tokens.colors.background.secondary }]}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Text variant="h3">Select Date</Text>
                  <Pressable onPress={() => setIsOpen(false)}>
                    <Icon name="close" size={24} color="primary" />
                  </Pressable>
                </View>

                <ScrollView contentContainerStyle={styles.modalContent}>
                  <Calendar
                    selectedDate={value}
                    onSelectDate={handleSelect}
                    minDate={minDate}
                    maxDate={maxDate}
                  />

                  <Spacer size={6} />

                  {/* Quick select buttons */}
                  <View style={styles.quickSelect}>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => handleSelect(formatDate(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                      ))}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        handleSelect(formatDate(
                          yesterday.getFullYear(),
                          yesterday.getMonth(),
                          yesterday.getDate()
                        ));
                      }}
                    >
                      Yesterday
                    </Button>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 56,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalContent: {
    padding: 16,
  },
  calendar: {
    padding: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  dayDisabled: {
    opacity: 0.3,
  },
  quickSelect: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
});
