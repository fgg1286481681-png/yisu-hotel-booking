import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export interface CalendarProps {
  // 模式：区间选择（住宿）或单选（钟点房）
  mode: 'range' | 'single';
  // 当前值：对于range模式是[startDate, endDate]，对于single模式是singleDate
  value?: string | [string, string];
  // 变化回调
  onChange?: (value: string | [string, string]) => void;
  // 是否显示
  visible: boolean;
  // 关闭回调
  onClose: () => void;
  // 最小可选日期（默认今天）
  minDate?: string;
  // 最大可选日期（默认今天+365天）
  maxDate?: string;
}

// 节假日数据（示例）
const HOLIDAYS: Record<string, string> = {
  '2026-02-17': '除夕',
  '2026-02-18': '春节',
  '2026-02-19': '春节',
  '2026-02-20': '春节',
  '2026-02-21': '春节',
  '2026-02-22': '春节',
  '2026-03-08': '妇女节',
  '2026-04-04': '清明',
  '2026-05-01': '劳动节',
  '2026-06-01': '儿童节',
  '2026-10-01': '国庆节',
  '2026-10-02': '国庆节',
  '2026-10-03': '国庆节',
  '2026-10-04': '国庆节',
  '2026-10-05': '国庆节',
  '2026-10-06': '国庆节',
  '2026-10-07': '国庆节',
};

// 调休数据（示例）
const WORKDAY_ADJUSTMENTS: Record<string, string> = {
  '2026-02-15': '班', // 调休上班
  '2026-02-16': '班', // 调休上班
  '2026-02-23': '休', // 调休休息
  '2026-02-24': '休', // 调休休息
};

// 获取某年某月的天数
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

// 获取某年某月第一天的星期（0-6，0表示周日）
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month - 1, 1).getDay();
};

// 格式化日期为 YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 解析日期字符串
const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// 比较日期是否相等
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// 判断日期是否在区间内
const isDateInRange = (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) return false;
  return date >= startDate && date <= endDate;
};

// 获取日期是今天还是明天
const getDayLabel = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (isSameDay(date, today)) return '今天';
  if (isSameDay(date, tomorrow)) return '明天';
  return '';
};

const Calendar: React.FC<CalendarProps> = ({
  mode,
  value,
  onChange,
  visible,
  onClose,
  minDate,
  maxDate,
}) => {
  // 状态管理
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedSingleDate, setSelectedSingleDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  // 初始化值
  useEffect(() => {
    if (mode === 'range' && Array.isArray(value)) {
      const [startStr, endStr] = value;
      if (startStr) setSelectedStartDate(parseDate(startStr));
      if (endStr) setSelectedEndDate(parseDate(endStr));
    } else if (mode === 'single' && typeof value === 'string') {
      setSelectedSingleDate(parseDate(value));
    }
  }, [mode, value]);

  // 当mode变化时，清除另一个模式的选择状态
  useEffect(() => {
    if (mode === 'range') {
      // 切换到range模式，清除single模式的选择
      setSelectedSingleDate(null);
    } else if (mode === 'single') {
      // 切换到single模式，清除range模式的选择
      setSelectedStartDate(null);
      setSelectedEndDate(null);
    }
  }, [mode]);
  
  // 星期标题
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  // 生成当前月的日期数组
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysArray = [];
    
    // 上个月的日期（填充空白）
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    
    // 当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth - 1, i);
      daysArray.push(date);
    }
    
    return daysArray;
  }, [currentYear, currentMonth]);
  
  // 处理日期点击
  const handleDateClick = (date: Date) => {
    if (mode === 'range') {
      // 区间选择模式
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // 第一次选择或重新选择
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else if (selectedStartDate && !selectedEndDate) {
        // 选择结束日期
        let startDate = selectedStartDate;
        let endDate = date;
        
        if (date < selectedStartDate) {
          // 如果选择的日期早于起始日期，交换
          startDate = date;
          endDate = selectedStartDate;
          setSelectedStartDate(date);
          setSelectedEndDate(selectedStartDate);
        } else {
          setSelectedEndDate(date);
        }
        
        // 触发回调，确保入住日期小于离店日期
        if (onChange) {
          onChange([formatDate(startDate), formatDate(endDate)]);
        }
      }
    } else {
      // 单选模式
      setSelectedSingleDate(date);
      
      // 触发回调
      if (onChange) {
        onChange(formatDate(date));
      }
    }
  };
  
  // 获取日期的显示状态
  const getDateState = (date: Date) => {
    const dateStr = formatDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isToday = isSameDay(date, today);
    const isSelected = mode === 'single' 
      ? selectedSingleDate && isSameDay(date, selectedSingleDate)
      : (selectedStartDate && isSameDay(date, selectedStartDate)) || 
        (selectedEndDate && isSameDay(date, selectedEndDate));
    
    const isInRange = mode === 'range' && isDateInRange(date, selectedStartDate, selectedEndDate);
    const isStart = selectedStartDate && isSameDay(date, selectedStartDate);
    const isEnd = selectedEndDate && isSameDay(date, selectedEndDate);
    
    const holiday = HOLIDAYS[dateStr];
    const workdayAdjustment = WORKDAY_ADJUSTMENTS[dateStr];
    const dayLabel = getDayLabel(date);
    
    return {
      isToday,
      isSelected,
      isInRange,
      isStart,
      isEnd,
      holiday,
      workdayAdjustment,
      dayLabel,
    };
  };
  
  // 切换到上个月
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // 切换到下个月
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // 如果没有显示，返回null
  if (!visible) return null;
  
  return (
    <View className="calendar-modal-mask">
      <View className="calendar-modal-overlay" onClick={onClose} />
      <View className="calendar-modal-panel">
        {/* 头部 */}
        <View className="calendar-header">
          <Text className="calendar-title">选择日期</Text>
          <View className="calendar-close" onClick={onClose}>
            <Text>✕</Text>
          </View>
        </View>
        
        {/* 月份导航 */}
        <View className="calendar-month-nav">
          <View className="calendar-nav-button" onClick={goToPreviousMonth}>
            <Text>‹</Text>
          </View>
          <Text className="calendar-month-title">{currentYear}年{currentMonth}月</Text>
          <View className="calendar-nav-button" onClick={goToNextMonth}>
            <Text>›</Text>
          </View>
        </View>
        
        {/* 星期标题 */}
        <View className="calendar-week-header">
          {weekDays.map((day, index) => (
            <View key={index} className="calendar-week-day">
              <Text className={`week-day-text ${index === 0 || index === 6 ? 'weekend' : ''}`}>
                {day}
              </Text>
            </View>
          ))}
        </View>
        
        {/* 日期网格 */}
        <ScrollView className="calendar-scroll" scrollY>
          <View className="calendar-grid">
            {days.map((date, index) => {
              if (!date) {
                return <View key={index} className="calendar-day empty" />;
              }
              
              const {
                isToday,
                isSelected,
                isInRange,
                isStart,
                isEnd,
                holiday,
                workdayAdjustment,
                dayLabel,
              } = getDateState(date);
              
              const day = date.getDate();
              const dateStr = formatDate(date);
              
              return (
                <View
                  key={index}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <View className="day-content">
                    <Text className="day-number">{day}</Text>
                    {dayLabel && <Text className="day-label">{dayLabel}</Text>}
                    {holiday && <Text className="holiday-label">{holiday}</Text>}
                    {workdayAdjustment && <Text className="workday-adjustment">{workdayAdjustment}</Text>}
                    {isStart && mode === 'range' && <Text className="range-label">入住</Text>}
                    {isEnd && mode === 'range' && <Text className="range-label">离店</Text>}
                  </View>
                </View>
              );
            })}
          </View>
          
          {/* 下个月预览 */}
          <View className="next-month-preview">
            <Text className="next-month-title">
              {currentMonth === 12 ? `${currentYear + 1}年1月` : `${currentYear}年${currentMonth + 1}月`}
            </Text>
            <Text className="next-month-hint">继续滑动查看更多日期</Text>
          </View>
        </ScrollView>
        
        {/* 底部操作按钮 */}
        <View className="calendar-actions">
          <View className="calendar-button clear-button" onClick={() => {
            if (mode === 'range') {
              setSelectedStartDate(null);
              setSelectedEndDate(null);
            } else {
              setSelectedSingleDate(null);
            }
          }}>
            <Text>清除</Text>
          </View>
          <View className="calendar-button confirm-button" onClick={onClose}>
            <Text>确定</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Calendar;
