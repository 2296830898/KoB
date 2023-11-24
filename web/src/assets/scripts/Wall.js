import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#B37226";
    }
    //ctx代表着Canvas 2D 渲染上下文（Context），它是通过 this.gamemap.ctx 获取的。
    //CanvasRenderingContext2D（通常简写为ctx）是 HTML5 Canvas API 提供的对象，用于在 HTML <canvas> 元素上进行 2D 渲染。
    update() {
        this.render();
    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}