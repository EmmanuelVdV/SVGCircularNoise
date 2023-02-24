// const { SVG } = require("@svgdotjs/svg.js");

class ShapeBezier {
    constructor(isSingularity, angle, ctrlPtX, ctrlPtY) {
        let angle1 = angle + Math.PI/2;
        let angle2 = angle - Math.PI/2;
        // let angle3 = Math.random() * Math.PI * 2;
        // let angle4 = Math.random() * Math.PI * 2;

        //// POSSIBLE DE NE PLUS FAIRE DE THIS
        this.startPt = new SVG.Point(xCenter + radius * Math.cos(angle1), yCenter + radius * Math.sin(angle1));
        this.stopPt = new SVG.Point(xCenter + radius * Math.cos(angle2), yCenter - radius * Math.sin(angle2));
        this.ctrlPt1 = new SVG.Point(xCenter /*+ ctrlPtX * amplitudeX */, this.startPt.y + deltY * (Math.min(0, - amplitudeY + Math.abs(yCenter-this.startPt.y))));

        //this.ctrlPt1 = new SVG.Point(xCenter + radius * 0.7 * Math.cos(angle3), yCenter + radius * 0.7 * Math.sin(angle3));
        // this.ctrlPt2 = new SVG.Point(xCenter + radius * Math.cos(angle4), yCenter + radius * Math.sin(angle4));
        // console.log("start", this.startPt);
        // console.log("stop", this.stopPt);

        this.isSingularity = isSingularity;

        this.curve = new Bezier(this.startPt.x, this.startPt.y, this.ctrlPt1.x, this.ctrlPt1.y, /* this.ctrlPt2.x, this.ctrlPt2.y, */ this.stopPt.x, this.stopPt.y);
        // this.path = 'M0 ' + this.startPt.y + ' ' + this.startPt.x + ' ' + this.startPt.y;
        this.path = this.curve.toSVG();
        // this.path += 'H' + w;
        // console.log(this.path);

        // INUTILE - UTILISER toSVG() de Bezier.js
        // this.path = 'M' + this.startPt.x + ' ' + this.startPt.y + ' '; // move to start point
        // this.path += 'C' + this.ctrlPt1.x + ' ' + this.ctrlPt1.y + ' ' +
        //     this.ctrlPt2.x + ' ' + this.ctrlPt2.y + ' '; // cubic bezier control points (absolute coordinates)
        // this.path += this.stopPt.x + ' ' + this.stopPt.y; // target point

        // this.calculateRays();
    }

    calculateRays() {
        this.Rays = [];
        
        for (let t=0; t<=1; t+=stepRays) {
            let pt = this.curve.get(t);
            let nv = this.curve.normal(t);
            this.Rays.push([pt, new SVG.Point(pt.x+rayLength*nv.x, pt.y+rayLength*nv.y)]);
        }
    }


    draw(d, g) {
        let pa = d.path(this.path);
        pa.stroke({ color: '#FFFFFF', width: sw }).fill('none'); // draw path
        g[1].add(pa); // add to other group

        /* let col = SVG.Color.random('rgb');

        this.Rays.forEach(r => {
            let l = d.line(r[0].x, r[0].y, r[1].x, r[1].y);
            l.stroke({ color: col, opacity: 0.4, width: sw }).fill('none'); // draw path
            g[1].add(l); // add to other group
        }) */
    }

}