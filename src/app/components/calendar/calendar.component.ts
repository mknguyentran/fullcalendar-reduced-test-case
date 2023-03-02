import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from "@fullcalendar/common";
import { CalOptions } from "./calendar-options";
import { Calendar } from "@fullcalendar/core";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { RRuleSet, RRule } from 'rrule';
import * as moment from "moment";
import { Moment } from "moment";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('cal', { static: false }) public cal: FullCalendarComponent;

  public options: CalendarOptions;
  public api: Calendar;
  constructor() { }

  ngOnInit() {
    this.options = {
      ...CalOptions,
      initialView: 'listForever',
      eventClick: (event) => console.log(event),
      eventDidMount: function(info) {
        info.el.setAttribute('recurring', info.event.extendedProps.recurring);
        info.el.setAttribute('title', `${info.timeText} - ${info.event.title}`);
      },
      headerToolbar: {
        left: '',
        center: '',
        right: 'listForever,timeGridWeek,timeGridDay'
      },
    };
  }

  public ngAfterViewInit(): void {
    this.api = this.cal.getApi();

    const startDate = moment().add(0, 'day').set({hour: 22}).utc();
    // This
    // const startDate = moment().set({hour: 22}).utc();

    const endDate = moment().add(5, 'day').set({hour: 5}).utc();

    const recurringEvents = [
      {
        "extendedProps": {
          "recurring": true
        },
        "title": "Recurring appointment",
        "start": startDate.toDate(),
        "end": endDate.toDate(),
        "id": "1",
        "allDay": false,
        "backgroundColor": "#94d8ff",
        "borderColor": "#94d8ff",
        "rrule": this.toRRuleSet(startDate, endDate).toString(),
        "duration": this.getDurationString(startDate, endDate)
      }
    ];

    this.api.addEventSource(recurringEvents);
  }

  public toRRuleSet(seriesStartDate: Moment, seriesEndDate: Moment): RRuleSet {
    const rrule = new RRule({
      dtstart: rruleDateTime(
        seriesStartDate.get('year'),
        seriesStartDate.get('month'),
        seriesStartDate.get('date'),
        seriesStartDate.get('hour'),
        seriesStartDate.get('minute')),
      until: rruleDateTime(
        seriesEndDate.get('year'),
        seriesEndDate.get('month'),
        seriesEndDate.get('date'),
        seriesStartDate.get('hour'),
        seriesStartDate.get('minute')),
      freq: RRule.DAILY,
      interval: 1,
    });

    const set = new RRuleSet();
    set.rrule(rrule);

    return set;
  }

  public getDurationString(seriesStartDate: Moment, seriesEndDate: Moment): string {
    const startMoment = seriesStartDate.set({ y: 1, M: 1, D: 1 });
    let endMoment = seriesEndDate.set({ y: 1, M: 1, D: 1 });

    if (startMoment.isAfter(endMoment)) {
      endMoment = endMoment.add(1, 'day');
    }

    const diffInMinutes = endMoment.diff(startMoment, 'minutes');
    const duration = startMoment.set({ h: 0, m: 0, s: 0, ms: 0 }).add(diffInMinutes, 'minutes');
    return duration.format('HH:mm:ss');
  }
}
export const rruleDateTime = function (y: number, m: number, d: number, h = 0, mi = 0) {
  return new Date(Date.UTC(y, m, d, h, mi, 0, 0));
};
