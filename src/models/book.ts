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