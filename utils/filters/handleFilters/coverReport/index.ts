// Utils
import { FetchCoverReport } from "@/utils/fetchs/coverReport";

// Tipagem
import { ItemsDavData } from "@/types/davs";
import { DateValue } from "@heroui/react";
import { RangeValue } from "@react-types/shared";
import getCurrentDateDetails from "@/utils/getDate";
import { parseDate } from "@internationalized/date";
import { ItemsCoverReportData } from "@/types/coverReport";
interface CoverReportProps {
  date?: RangeValue<DateValue> | null;
  token: string;
  setLoading: (value: boolean) => void;
  setDate?: (value: RangeValue<DateValue>) => void;
  setCoverSales: (value: ItemsDavData[]) => void;
  setSalesSummary: (value: ItemsCoverReportData[]) => void;
}

export async function handleRefresh({
  date,
  token,
  setLoading,
  setCoverSales,
  setSalesSummary,
}: CoverReportProps) {
  if (!date) return;

  await FetchCoverReport({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setLoading,
    setCoverSales,
    setSalesSummary,
  });
}

export async function handleCleanFilter({
  date,
  token,
  setLoading,
  setDate,
  setCoverSales,
  setSalesSummary,
}: CoverReportProps) {
  if (!date || !setDate) return;

  const { today } = getCurrentDateDetails();

  setDate({
    start: parseDate(new Date(today).toISOString().split("T")[0]),
    end: parseDate(new Date(today).toISOString().split("T")[0]),
  });

  await FetchCoverReport({
    dateInit: today,
    dateEnd: today,
    token,
    setLoading,
    setCoverSales,
    setSalesSummary,
  });
}

export async function handleDateFilter({
  date,
  token,
  setLoading,
  setDate,
  setCoverSales,
  setSalesSummary,
}: CoverReportProps) {
  if (!date || !setDate) return;

  setDate(date);

  await FetchCoverReport({
    dateInit: `${date.start.year}/${date.start.month}/${date.start.day}`,
    dateEnd: `${date.end.year}/${date.end.month}/${date.end.day}`,
    token,
    setLoading,
    setCoverSales,
    setSalesSummary,
  });
}
