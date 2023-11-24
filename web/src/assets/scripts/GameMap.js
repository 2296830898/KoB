import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();    //先调父类构造底图，然后绘制再把底图覆盖掉
        
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;

        this.rows = 15;
        this.cols = 16;
        
        this.inner_walls_count = 24; //内部障碍物的数量，注意对称
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this),
        ]
    }

    check_connectivity(g, sx, sy, tx, ty) {
        if (sx == tx && sy == ty) return true;  //递归结果，当前位置就是目标位置，表示走通。
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            // 如果下一步不是墙并且能走通
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }

        return false;
    } 

    //  判断两条蛇是否准备好了
    checck_ready() {
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    //  让两条蛇进入下一回合
    next_step() {
        for (const snake of this.snakes) {
            snake.next_step;
        }
    }

    create_walls() {
        // 初始没有墙
        const g = [];   //bool数组证明是否有墙,row代表行，cols代表列.
        for (let r = 0; r < this.rows;  r ++ ) {
            g[r] = [];
            for (let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;
            }
        }

        // 给两列加上墙。
        for (let r = 0; r < this.rows; r ++ ) {
            // 第一列和最后一列.
            g[r][0] = g[r][this.cols - 1] = true;
        }
        // 给两行加上墙
        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows -1][c] = true;
        }

        // 创建随机障碍物，其中random()创建一个[0,1)的随机值,每次放2个，所以除以2
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (let j = 0; j < 1000; j ++ ) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);

                //如果此处有了或者此处是出生点
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;
                if (g[this.rows - 2][1] || g[1][this.cols - 2]) continue;

                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
                break;
            }
        }

        //  判断迷宫是否连通
        const copy_g = JSON.parse(JSON.stringify(g));   //  复制地图样本
        if (!this.check_connectivity(copy_g, this.rows -2, 1, 1, this.cols -2))
            return false;

        //  生成墙
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if(g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        
        return true;
    }

    //  监听键盘输入
    add_listening_events() {
        this.ctx.canvas.focus();

        const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e =>{
            if (e.key === 'w') snake0.set_direction(0);
            else if (e.key === 'd') snake0.set_direction(1);
            else if (e.key === 's') snake0.set_direction(2);
            else if (e.key === 'a') snake0.set_direction(3);
            else if (e.key === 'ArrowUp') snake1.set_direction(0);
            else if (e.key === 'ArrowRight') snake1.set_direction(1);
            else if (e.key === 'ArrowDown') snake1.set_direction(2);
            else if (e.key === 'ArrowLeft') snake1.set_direction(3);
        })
    }

    start() {
        //  只有连通才能生成墙
        for (let i = 0; i < 1000; i ++ )
            if (this.create_walls())
                break;
        this.add_listening_events();    
    }

    update_size() {
        // 为了避免墙有白缝，通过parseInt将单位格距离取成整像素。
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_size();
        this.render();
    }

    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}