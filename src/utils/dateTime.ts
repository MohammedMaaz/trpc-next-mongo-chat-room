import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advanceFormat from "dayjs/plugin/advancedFormat";

// load plugins
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(advanceFormat);

export function formattedDateTime(date: string | Date | Dayjs) {
  const given = dayjs(date);
  const now = dayjs();

  if (given.isSame(now, "day")) {
    return given.fromNow();
  } else if (given.isSame(now.subtract(1, "day"), "day")) {
    return `Yesterday - ${given.format("LT")}`;
  } else if (given.isSame(now, "week")) {
    return given.format("ddd - LT");
  } else if (given.isSame(now, "year")) {
    return given.format("ddd MMM Do - LT");
  } else {
    return given.format("ddd MMM Do YYYY - LT");
  }
}
