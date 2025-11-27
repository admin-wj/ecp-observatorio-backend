const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

import { DateRange } from '../types/shared.types';
import { RAGEndpoints } from '../enums';

dayjs.extend(utc);

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

export const getFormattedDate = (date: Date) =>
  dayjs.utc(date).format('DD/MM/YYYY');

export const getFileFormattedDate = (date: Date) =>
  dayjs.utc(date).format('DD_MM_YYYY_HH_mm_ss');

export const getYear = (date: Date) =>
  date ? dayjs.utc(date).format('YYYY') : '';

export const getReportDates = (endpoint: RAGEndpoints): DateRange => {
  switch (endpoint) {
    case RAGEndpoints.Pairs_Ranking:
      return getReportDateRange('year');
    case RAGEndpoints.VTT_News:
      return getReportDateRange('week');
    case RAGEndpoints.VTT_Demands:
      return getReportDateRange('week');
    case RAGEndpoints.VTT_Daily:
      return getReportDateRange('day');
    default:
      return getReportDateRange();
  }
};

export const getReportDateRange = (
  rangeType: 'day' | 'week' | 'month' | 'year' = 'month',
): DateRange => {
  const now = new Date();

  switch (rangeType) {
    case 'day':
      return {
        startDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          0,
          0,
          0,
        ).toISOString(),
        endDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          23,
          59,
          59,
        ).toISOString(),
      };

    case 'week':
      return {
        startDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7,
          0,
          0,
          0,
        ).toISOString(),
        endDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          23,
          59,
          59,
        ).toISOString(),
      };

    case 'year':
      return {
        startDate: new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0).toISOString(),
        endDate: new Date(
          now.getFullYear() - 1,
          11,
          31,
          23,
          59,
          59,
        ).toISOString(),
      };

    default:
      return {
        startDate: new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
          0,
          0,
          0,
        ).toISOString(),
        endDate: new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
        ).toISOString(),
      };
  }
};
