const prices = [
    { min: 0, max: 1, value: 'Dưới 1 triệu', code: 'OU1N' },
    { min: 1, max: 2, value: 'Từ 1 - 2 triệu', code: '1U2N' },
    { min: 2, max: 3, value: 'Từ 2 - 3 triệu', code: '2U3N' },
    { min: 3, max: 5, value: 'Từ 3 - 5 triệu', code: '3U5N' },
    { min: 5, max: 7, value: 'Từ 5 - 7 triệu', code: '5U7N' },
    { min: 7, max: 10, value: 'Từ 7 - 10 triệu', code: '7U0N' },
    { min: 10, max: 15, value: 'Từ 10 - 15 triệu', code: '1E1N' },
    { min: 15, max: 999, value: 'Trên 15 triệu', code: 'EU5N' }
]

const areas = [
    { min: 0, max: 20, value: 'Dưới 20m', code: 'ON2E' },
    { min: 20, max: 30, value: 'Từ 20m - 30m', code: '2UMD' },
    { min: 30, max: 50, value: 'Từ 30m - 50m', code: '3UMD' },
    { min: 50, max: 70, value: 'Từ 50m - 70m', code: '5UMD' },
    { min: 70, max: 90, value: 'Từ 70m - 90m', code: '7UMD' },
    { min: 90, max: 9999, value: 'Trên 90m', code: 'EN9E' }
]

export const dataPrice = prices
export const dataArea = areas