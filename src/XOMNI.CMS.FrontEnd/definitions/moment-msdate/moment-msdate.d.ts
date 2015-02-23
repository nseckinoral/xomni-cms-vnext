/// <reference path="../moment/moment.d.ts" />

declare module moment {
    interface Moment {
        fromOADate(msDate: number): moment.Moment;
        toOADate(): number;
    }
}