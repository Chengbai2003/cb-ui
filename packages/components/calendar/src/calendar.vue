<template>
  <div :class="bem.b()">
    <div :class="bem.e('header')">
      <div :class="bem.e('title')">{{currentDate}}</div>
      <div :class="bem.e('button-group')">
        <c-button @click="selectDate('prev-year')" type="primary">前一年</c-button>
        <c-button @click="selectDate('prev-month')" type="primary">上个月</c-button>
        <c-button @click="selectDate('today')" type="primary">今天</c-button>
        <c-button @click="selectDate('next-month')" type="primary">下个月</c-button>
        <c-button @click="selectDate('next-year')" type="primary">后一年</c-button>
      </div>
    </div>
    <div :class="bem.e('body')">
      <table :class="calendarTable.b()" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th  v-for="(day, index) in weekDays" :key="index">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rid) in rows" :key="rid">
            <td
              v-for="(cell, cid) in row"
              :key="cid"
              :class="[day.b(), getCellClass(cell)]"
              @click="handlePickDay(cell)"
            >
              <slot name="date-cell" :data="getSlotData(cell)">
                {{ cell.text }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@chengbai/utils/create';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

import { computed, ref } from 'vue';
import { CalendarDateCell, CalendarDateCellType, CalendarDateType, calendarEmits, calendarProps } from './calendar'
import { Dayjs } from 'dayjs';

const bem = createNamespace('calendar')
const calendarTable = createNamespace('calendar-table')
const day = createNamespace('calendar-day')
defineOptions({
  name: 'c-calendar',
})

const props = defineProps(calendarProps)
const now = dayjs()
const date = computed(() => {
  if (!props.modelValue) {
    return now
  } else {
    return dayjs(props.modelValue)
  }
})

// 表头部分
const firstDayofWeek = dayjs().startOf('week').day()
const weekMaping = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const weekDays = computed(() => {
  return [
    ...weekMaping.slice(firstDayofWeek),
    ...weekMaping.slice(0, firstDayofWeek)
  ]
})
// 面板部分
const rows = computed(() => {
  let list: CalendarDateCell[] = []
  const firstDay = date.value.startOf('month').day();// 获取本月第一天是星期几
  const lastDay = date.value.subtract(1, 'month').endOf('month').date();
  const count = firstDay - firstDayofWeek //本月前面需补齐的天数
  const prevMonthDays: CalendarDateCell[] = Array.from({ length: count })
  .map((_, idx) => lastDay - (count - idx - 1))
  .map(_ => ({
    text: _,
    type: 'prev'
  }))
  // 获取当前月有多少天
  const days = date.value.daysInMonth()
  const currentMonthDays: CalendarDateCell[] = Array.from({ length: days }).map((_, idx) => ({
    text: idx + 1,
    type: 'current'
  }))
  list = [...prevMonthDays,...currentMonthDays]
  let remaingDays = 42 - list.length
  const nextMonthDays: CalendarDateCell[] = Array.from({ length: remaingDays })
  .map((_, idx) => ({
    text: idx + 1,
    type: 'next'
  }))
  list.push(...nextMonthDays)
  return Array.from({ length: 6}).map((_, idx) => {
    const start = idx * 7
    return list.slice(start, start + 7)
  })
})

const prevMonthDay = computed(() => date.value.subtract(1, 'month').date(1))
const nextMonthDay = computed(() => date.value.add(1, 'month').date(1))
const prevYearDay = computed(() => date.value.subtract(1, 'year').date(1))
const nextYearDay = computed(() => date.value.add(1, 'year').date(1))

const emit = defineEmits(calendarEmits)
function pickDay(day: Dayjs) {
  selectDay.value = day; // 选中保存选中的
  emit('update:modelValue', day.toDate());
}
const selectDate = (type: CalendarDateType) => {
  const dateMap:Record<CalendarDateType, Dayjs> = {
    'prev-year': prevYearDay.value,
    'prev-month': prevMonthDay.value,
    'today': now,
    'next-month': nextMonthDay.value,
    'next-year': nextYearDay.value,
  }
  const day = dateMap[type] // 选中日期 更改date
  pickDay(day);
}

function formatter(text: number, type: CalendarDateCellType): Dayjs {
  switch(type) {
    case 'prev':
      return date.value.startOf('month').subtract(1, 'month').date(text);
    case 'current':
      return date.value.date(text);
    case 'next':
      return date.value.startOf('month').add(1, 'month').date(text);
    default:
      return now
  }
}
const selectDay = ref<Dayjs>(); //用于标识当前用户选择时哪一个
const handlePickDay = ({ text, type }: CalendarDateCell) => {
  let day = formatter(text, type)
  pickDay(day)
}

const getCellClass = ({ text, type }: CalendarDateCell) => {
  const clazz: string[] = [type];
  const date =formatter(text, type);
  if(date.isSame(selectDay.value, 'day')) {
    // 如果选中的日期和 当前循序的日期相同
    clazz.push(day.is('selected', true));
  }
  if(date.isSame(now, 'day')) {
    clazz.push(day.is('today', true));
  }
  return clazz;
}
function getSlotData({ text, type }: CalendarDateCell) {
  let day = formatter(text, type)
  return {
    isSelected: day.isSame(selectDay.value, 'day'),
    day: day.format('YYYY-MM-DD'),
    date: day.toDate(),
  }
}

const currentDate = computed(() => {
  return `${date.value.year()}年${date.value.month() + 1}月${date.value.date()}日`
})
</script>

<style scoped>

</style>