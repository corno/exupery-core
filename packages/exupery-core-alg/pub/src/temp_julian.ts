
export const temp_julian_date_to_iso = (julian_date: number): string => {
    const julian_offset = 2440587 // Julian Day Number (JDN) at Unix epoch (1970-01-01T00:00:00Z)

    // The Julian date without the 1/2 day offset is called the "Julian Day Number" (JDN)

    const milliseconds_since_epoch = (julian_date - julian_offset) * 86400000 // 86400000 milliseconds in a day

    const date = new Date(milliseconds_since_epoch)

    return date.toISOString().split('T')[0] // This returns only the date portion (e.g., "2023-12-25")
}