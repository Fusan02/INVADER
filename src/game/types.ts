export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export enum GameState {
    PLAYING = 'PLAYING',
    GAME_OVER = 'GAME_OVER',
    GAME_CLEAR = 'GAME_CLEAR',
}

