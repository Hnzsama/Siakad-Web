export const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
};

export const calculateTimeSlots = (start: string, end: string, duration: number) => {
    const timeSlots = [];
    let currentTime = start;
    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);

    while (startDate <= endDate) {
        timeSlots.push(currentTime);
        startDate.setMinutes(startDate.getMinutes() + duration);
        currentTime = startDate.toTimeString().substring(0, 5);
    }

    return timeSlots;
};
