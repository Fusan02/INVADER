export const GAME_CONFIG = {
    canvas: {
        width: 800,
        height: 600,
    },
    player: {
        width: 40,
        height: 30,
        speed: 5,
    },
    enemy: {
        rows: 5,        // 敵の行数
        cols: 11,       // 敵の列数
        width: 30,
        height: 20,
        spacing: 10,    // 敵同士の間隔
        offsetX: 50,    // 左端からの開始位置
        offsetY: 50,    // 上端からの開始位置
        speed: 1,       // 移動速度
        step: 1,        // フレームあたり下がる距離
        totalDownDistance: 20,
    },
    bullet: {
        width: 3,
        height: 10,
        speed: 7,
    },
};