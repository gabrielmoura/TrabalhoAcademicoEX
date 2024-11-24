import {formatDuration, intervalToDuration} from 'date-fns';

export function formatTime(seconds) {
    const duration = intervalToDuration({start: 0, end: seconds * 1000});
    return formatDuration(duration);
}

export function formatDateTime(date?: string | Date) {
    if (!date) {
        return "";
    }
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}