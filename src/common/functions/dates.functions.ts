import { DateRange } from '../types/shared.types';

export const getDateRangeQuery = (
  dateQuery?: DateRange,
  needsPastData?: boolean,
  defaultDaysNumber: number = 0,
) => {
  let sDate = new Date();
  (sDate as Date).setDate((sDate as Date).getDate() - defaultDaysNumber);
  let eDate = new Date();

  const filters = {
    startDate: dateQuery?.startDate ?? undefined,
    endDate: dateQuery?.endDate ?? undefined,
  };

  const { startDate, endDate } = filters;

  if (startDate && endDate) {
    sDate = new Date(startDate);
    eDate = new Date(endDate);
  }

  if (needsPastData) {
    const { pastStartDate, pastEndDate } = getPastDateRange(sDate, eDate);
    sDate = pastStartDate;
    eDate = pastEndDate;
  }

  sDate = new Date(
    Date.UTC(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), 0, 0, 0),
  );
  eDate = new Date(
    Date.UTC(
      eDate.getFullYear(),
      eDate.getMonth(),
      eDate.getDate(),
      23,
      59,
      59,
    ),
  );

  return {
    timestamp: {
      $gte: sDate,
      $lte: eDate,
    },
  };
};

export const getPastDateRange = (startDate: Date, endDate: Date) => {
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const timeDifference = endDate.getTime() - startDate.getTime();
  const numberOfDays = Math.round(timeDifference / millisecondsInADay) + 1;

  const pastStartDate = new Date(
    startDate.getTime() - numberOfDays * millisecondsInADay,
  );
  const pastEndDate = new Date(
    endDate.getTime() - numberOfDays * millisecondsInADay,
  );

  return { pastStartDate, pastEndDate };
};
