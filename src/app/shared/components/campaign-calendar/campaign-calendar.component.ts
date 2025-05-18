import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ICampaign} from '../../../core/interfaces';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isCampaignEndDay: boolean;
  isCampaignStartDay: boolean;
  isWeekend: boolean;
  dayNumber: number;
}

@Component({
  selector: 'app-campaign-calendar',
  templateUrl: './campaign-calendar.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class CampaignCalendarComponent implements OnInit {
  @Input() campaign?: ICampaign;

  currentDate = new Date();
  currentMonth: number;
  currentYear: number;

  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];

  constructor() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
  }

  ngOnInit(): void {
    this.generateCalendarDays();
  }

  ngOnChanges(): void {
    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    if (!this.campaign) return;

    this.calendarDays = [];

    // First day of the month
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    // Last day of the month
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Get the day of the week for the first day (0-6)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Days from previous month to fill first week
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        isCampaignEndDay: this.isCampaignEndDay(date),
        isCampaignStartDay: this.isCampaignStartDay(date),
        isWeekend: this.isWeekend(date),
        dayNumber: date.getDate()
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        isCampaignEndDay: this.isCampaignEndDay(date),
        isCampaignStartDay: this.isCampaignStartDay(date),
        isWeekend: this.isWeekend(date),
        dayNumber: i
      });
    }

    // Fill remaining days for the last week
    const remainingDays = 7 - (this.calendarDays.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        this.calendarDays.push({
          date,
          isCurrentMonth: false,
          isToday: this.isToday(date),
          isCampaignEndDay: this.isCampaignEndDay(date),
          isCampaignStartDay: this.isCampaignStartDay(date),
          isWeekend: this.isWeekend(date),
          dayNumber: i
        });
      }
    }
  }

  changeMonth(direction: number): void {
    this.currentMonth += direction;

    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }

    this.generateCalendarDays();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  isCampaignEndDay(date: Date): boolean {
    if (!this.campaign) return false;

    const endDate = new Date(this.campaign.event_date);
    return date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear();
  }

  isCampaignStartDay(date: Date): boolean {
    if (!this.campaign) return false;

    const startDate = new Date(this.campaign.created_at);
    return date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear();
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  }

  getMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }
}
