export enum DateRange {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    MonthYesterday = 'month yesterday',
    Year = 'year'
}
export type DateRangeState = {
    start: string;
    end: string;
};