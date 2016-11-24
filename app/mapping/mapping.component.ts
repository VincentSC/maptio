import {
    Component,
    AfterViewInit,
    ViewChild,
    OnInit
} from '@angular/core';

import {
    D3Service, D3, Selection,
    PackLayout, HierarchyNode, HierarchyCircularNode,
    Transition, Timer, BaseType
} from 'd3-ng2-service';
import * as d3r from 'd3-request';

import { DataService } from '../services/data.service'
import { ColorService } from '../services/color.service'
import { UIService } from '../services/ui.service'

@Component({
    selector: 'mapping',
    templateUrl: './mapping.component.html',
    styles: [require('./mapping.component.css').toString()],

})


export class MappingComponent {
    private d3: D3;
    private dataService: DataService;
    private colorService: ColorService;
    private uiService: UIService;
    private title: string;


    constructor(d3Service: D3Service, dataService: DataService, colorService: ColorService, uiService: UIService) {
        this.d3 = d3Service.getD3();
        this.dataService = dataService;
        this.colorService = colorService;
        this.uiService = uiService;

        this.dataService.getData().subscribe(data => {
            this.show(this.d3, this.uiService, data);
        });
    }

    show(d3: D3, uiService: UIService, data: any) {

        console.log(JSON.stringify(data));

        if (!data) {
            d3.select("svg").selectAll("*").remove();
            return;
        }

        d3.select("svg").selectAll("*").remove();
        var svg = d3.select("svg"),
            margin = 50,
            diameter = +svg.attr("width"),
            g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

        var color = this.colorService.getColorRange(this.d3.hsl(0, 0, 0.93), this.d3.hsl(251, 0.38, 0.5));

        var pack = d3.pack()
            .size([diameter - margin, diameter - margin])
            .padding(2);

        var root = data;

        root = d3.hierarchy(root)
            .sum(function (d: any) { return d.size; })
            .sort(function (a, b) { return b.value - a.value });

        this.title = root.data.name;

        var focus = root,
            nodes = pack(root).descendants(),
            view: any;

        var circle = g.selectAll("circle")
            .data(nodes)
            .remove()
            .enter()
            .append("circle")
            //.attr("id", function (d, i) { return i; })
            .attr("class", function (d: any) { return d.parent ? (d.children ? "node" : "node node--leaf") : "node node--root"; })
            .style("fill", function (d: any) { return d.children ? color(d.depth) : "white"; })
            .attr("id", function (d: any) { return "circle" + d.data.id; })
            .on("click", function (d: any, i: number) {
                console.log("CLICKING");
                if (focus !== d) {
                    zoom(d, i),
                        d3.selectAll("#title" + d.data.id).style("fill-opacity", 1).style("display", "inline"),
                        d3.event.stopPropagation();
                }
            })
            .on("mouseover", function (d:any) {
                d3.selectAll("#title" + d.data.id).classed("highlighted", true);
            })
            .on("mouseout", function (d:any) {
                d3.selectAll("#title" + d.data.id).classed("highlighted", false);
            });

        var definitions = svg.append("defs")
        var path = definitions.selectAll("path")
            .data(nodes)
            .enter()
            .append("path")
            .attr("id", function (d:any) { return "path" + d.data.id; });

        var text = g.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("id", function (d:any) { return "title" + d.data.id; })
            //.style("fill-opacity", function (d) { return d.parent === root ? 1 : 0.5; })
            .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
            .append("textPath")
            .attr("xlink:href", function (d:any) { return "#path" + d.data.id; })
            .attr("startOffset", function (d, i) { return "10%"; })
            .text(function (d: any) { return d.data.name; })
            .on("mouseover", function (d: any, i: any) {
                d3.selectAll("#title" + d.data.id).classed("highlighted", true);
                d3.select("g#description-group" + i).classed("hidden", false);
            })
            .on("mouseout", function (d:any, i:number) {
                d3.selectAll("#title" + d.data.id).classed("highlighted", false);
                d3.select("g#description-group" + i).classed("hidden", true);
            })

        // var descriptionIcon = g.selectAll("icon")
        //     .data(nodes)
        //     .enter().append('text')
        //     .attr("class", "icon")
        //     .attr("x", "-12px")
        //     .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
        //     .style("display", function (d: any) { return d.parent === root && d.data.description && d.data.description != "" ? "inline" : "none"; })
        //     .append("textPath")
        //     .attr("xlink:href", function (d, i) { return "#s" + i; })
        //     .attr("startOffset", function (d, i) { return "10%"; })
        //     .text(function (d: any) { return d.data.description === undefined ? "" : "\uf249" });

        var description = g.selectAll("description")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "hidden")
            .attr("id", function (d, i) { return "description-group" + i })

        var descriptionCircle = description
            .append("circle")
            .attr("class", "description")
            .style("fill", function (d) { return d.children ? color(d.depth) : "white" })
        var descriptionContent = description
            .append("text")
            .attr("class", "description")
            .attr("id", function (d, i) { return "description-content" + i })
            .attr("dy", 0)
            .attr("x", 0)
            .attr("y", 0)
            .text(function (d: any) { return d.data.description })

        var node = g.selectAll("path,circle,text");

        svg
            .style("background", color(-1))
            .on("click", function () { zoom(root, 0); });

        let zoomedNode: HierarchyCircularNode<any> = nodes.find(function (d: any) { return d.data.isZoomedOn === true });
        if (!zoomedNode) {
            console.log("CHOOSE ROOT")
            zoomedNode = root;
        }
        zoomTo([zoomedNode.x, zoomedNode.y, zoomedNode.r * 2 + margin], parseInt(zoomedNode.id));
        console.log(d3.selectAll("#title" + parseInt(zoomedNode.data.id)).node());
        d3.selectAll("#title" + parseInt(zoomedNode.data.id)).style("fill-opacity", 1).style("display", "inline");

        function zoom(d: any, index: number) {
            var focus0 = focus; focus = d;

            var transition = d3.transition("move")
                //.duration(d3.event.altKey ? 7500 : 750)
                .duration(750)
                .tween("zoom", function (d) {
                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function (t) { zoomTo(i(t), index); };
                });

            var updateCounter = 0;

            transition.selectAll("text")
                .filter(function (d: any) { return d.parent === focus || this.style.display === "inline"; })
                .style("fill-opacity", function (d: any) { return d.parent === focus || (d === focus && !d.children) ? 1 : (d === focus ? 0.4 : 0); })
                .on("start", function (d: any) { if (d.parent === focus) this.style.display = "inline"; })
                .each(function (d: any) { updateCounter++ })
                .on("end", function (d: any) {
                    //if (d.parent !== focus) this.style.display = "none"; 
                    updateCounter--;
                    if (updateCounter == 0) {
                        uiService.adjustLabels(text, (diameter / d.r / 2));
                    }
                })
        }


        function zoomTo(v: any, index: number) {
            var k = diameter / v[2]; view = v;
            node.attr("transform", function (d: any) {
                return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"
            });

            circle.attr("r", function (d: any) { return d.r * k; });

            path.attr("d", function (d, i) {
                var radius = d.r * k + 3;
                return uiService.getCircularPath(radius, -radius, 0);
            })

            descriptionCircle.attr("r", function (d) { return d.r * k });

            descriptionContent
                .each(function (d: any, i: number) {
                    if (i === index) {
                        uiService.wrap(d3.select(this), d.data.description, diameter * 0.65);
                    }
                });
        }
    }
}