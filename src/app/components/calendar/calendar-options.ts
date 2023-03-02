import { CalendarOptions } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import daLocale from '@fullcalendar/core/locales/da';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import ListPlugin from '@fullcalendar/list';

export const CalOptions: CalendarOptions = {
  droppable: false,
  editable: false,
  selectable: true,
  unselectAuto: true,
  locale: daLocale,
  nowIndicator: true,
  plugins: [timeGridPlugin, interactionPlugin, bootstrapPlugin, ListPlugin],
  themeSystem: 'bootstrap',
  height: 'auto',
  timeZone: 'local',
  weekNumbers: true,
  eventMinHeight: 30,
  views: {
    listForever: {
      type: 'list',
      duration: { days: 10000, hour: (new Date).getHours() }, // hour is set to today.getHours to prevent appointments earlier in the day showing.
    }
  },
};
