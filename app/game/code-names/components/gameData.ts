// src/data/gameData.ts
export type CardColor = 'blue' | 'red' | 'green' | 'black';

export interface Card {
    word: string;
    color: CardColor;
    revealed: boolean;
}

export const GRID_SIZE = 5;

export const gameCards: Card[] = [
    {word: "هری پاتر", color: "blue", revealed: false},
    {word: "کیبرد", color: "green", revealed: false},
    {word: "درخت", color: "red", revealed: false},
    {word: "حلزون", color: "green", revealed: false},
    {word: "دامن", color: "blue", revealed: false},
    {word: "سلامتی", color: "red", revealed: false},
    {word: "پرواز", color: "blue", revealed: false},
    {word: "شمشیر", color: "green", revealed: false},
    {word: "امریکا", color: "blue", revealed: false},
    {word: "تپانچه", color: "red", revealed: false},
    {word: "چشم", color: "green", revealed: false},
    {word: "بطری", color: "green", revealed: false},
    {word: "کشتی", color: "red", revealed: false},
    {word: "اب جوش", color: "blue", revealed: false},
    {word: "باقلوا", color: "red", revealed: false},
    {word: "پلنگ", color: "red", revealed: false},
    {word: "پاییز", color: "blue", revealed: false},
    {word: "نارنجی", color: "green", revealed: false},
    {word: "شمال", color: "green", revealed: false},
    {word: "خزنده", color: "blue", revealed: false},
    {word: "انگشتر", color: "green", revealed: false},
    {word: "خاک", color: "blue", revealed: false},
    {word: "گوگوش", color: "red", revealed: false},
    {word: "در", color: "black", revealed: false},
    {word: "همراه اول", color: "red", revealed: false},
];