export function formatTimestamps(start: number, end: number): string {
    const differenceInMilliseconds = end - start;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const hours = Math.floor(differenceInSeconds / 3600)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((differenceInSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (differenceInSeconds % 60).toString().padStart(2, "0");

    const formattedTime = `${hours}:${minutes}:${seconds}s`;
    return formattedTime;
}
