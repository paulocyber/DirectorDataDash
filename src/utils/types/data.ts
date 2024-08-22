export enum DateRange {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Year = 'year'
}
export type DateRangeState = {
    start: string;
    end: string;
};