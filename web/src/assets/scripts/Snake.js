import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)];    //存放蛇身，0表示蛇头
        this.next_cell = null;  // 下一步走去哪

        this.speed = 5;
        this.direction = -1;    //01表示没有指令，0，1，2，3表示上右下左。
        this.status = "idle";   //idle表示静止，move表示移动，die表示死亡

        this.dr = [-1, 0, 1, 0];//四个方向上的偏移量。
        this.dc = [0, 1, 0, -1];

        this.step = 0;          //表示回合数
    }

    start() {

    }

    //方向接口
    set_direction(d) {  
        this.direction = d;
    }

    //  将蛇的状态转为走下一步。
    next_step() {
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1;    //清空操作
        this.status = "move";
        this.step ++ ;
    }

    update_move() {

    }

    // 每一帧执行一次
    update() {

        if (this.status === 'move') {
            this.update_move();
        }
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}