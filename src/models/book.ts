export type Book = {
    id: string;
    title: string;
    author: string;
    readCount?: number;
    year?: number;
    genre?: string;
    description?: string;
    coverImage?: any;
    totalSteps?: number;
    content?: Array<{ id: number; text: string; requiredSteps: number }>;
};

export interface CurrentReadingInfo {
    title: string;
    author: string;
    unlockedSteps: number;
    totalSteps: number;
    percentage: number;
}