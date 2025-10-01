import { Position, Size } from './types';

// 矩形同士の衝突判定
export function checkCollision(
    pos1: Position,
    size1: Size,
    pos2: Position,
    size2: Size
): boolean {
    return(
        // これら全ての条件を満たすと衝突している。
        // 逆にどれかを満たさないと衝突はしていない。
        pos1.x < pos2.x + size2.width &&        // 矩形1の左端が矩形2の右端より左にある
        pos1.x + size1.width > pos2.x &&        // 矩形1の右端が矩形2の左端より右にある
        pos1.y < pos2.y + size2.height &&       // 矩形1の上端が矩形2の下端より上にある
        pos1.y + size1.height > pos2.y          // 矩形1の下端が矩形2の上端より下にある
    );
}