import { formatDuration, intervalToDuration } from 'date-fns';

export function formatTime(seconds) {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return formatDuration(duration);
}