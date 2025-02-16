import { ExtractPropTypes, PropType } from "vue";

export const calendarProps = {
  modelValue: {
    type: Date,
  },
  range: {
    type: Array as any as PropType<[Date, Date]>,
    default: () => []
  }
} as const;

export type CalendarProps = ExtractPropTypes<typeof calendarProps>;

// 事件类型
export const calendarEmits = {
  'update:modelValue': (value: Date) => value instanceof Date,
}

export type CalendarEmits = typeof calendarEmits;

export type CalendarDateCellType = 'prev' | 'current' | 'next';
export type CalendarDateCell = {
  text: number,
  type: CalendarDateCellType,
}

export type CalendarDateType = 'prev-year' |'prev-month' | 'today' | 'next-month' | 'next-year';