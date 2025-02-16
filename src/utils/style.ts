export const getMultiplierType = (multiplier: string) => {
    const value = Number(multiplier.replace('X', ''));
    if (value < 10) return 'sm';
    if (value < 100) return 'md';
    if (value < 1000) return 'lg';
    return 'xl';
}

export const getRankChar = (rank: number) => {
    const charList = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', ''];
    if (rank >= 10) return '';
    return charList[rank];
}