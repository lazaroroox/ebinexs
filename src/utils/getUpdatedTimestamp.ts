export const getUpdatedTimestamp = (date: Date | null, minutes: number): number => {
    if (!date) return Date.now();
  
    const updatedDate = new Date(date);
    updatedDate.setMinutes(updatedDate.getMinutes() + minutes);
    updatedDate.setSeconds(0, 0);
  
    return updatedDate.getTime();
  };