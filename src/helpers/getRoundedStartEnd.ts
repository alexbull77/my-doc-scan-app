import dayjs from "dayjs";

export const getRoundedStartEnd = (dateStr: string) => {
  const now = dayjs();
  const nextHalfHour = now
    .startOf("hour")
    .add(now.minute() < 30 ? 30 : 60, "minute");

  const start = dayjs(dateStr)
    .hour(nextHalfHour.hour())
    .minute(nextHalfHour.minute());
  const end = start.add(30, "minute");

  return {
    start: start.format("YYYY-MM-DD HH:mm"),
    end: end.format("YYYY-MM-DD HH:mm"),
  };
};
