export interface Letter {
    character: string;
    nikud: string;
}

export interface Nikud {
    name: string;
    symbol: string;
} 

export interface AssessmentResult {
    letter: Letter;
    pronunciationCorrect: boolean;
    timestamp: Date;
}