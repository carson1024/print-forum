import { CallReportType } from "types/calls";

export let pairsCache: {
    [key: string]: CallReportType
} = {};

export const clearCache = () => {
    pairsCache = {};
}