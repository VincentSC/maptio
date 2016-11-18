import { Component, OnInit, ViewChild, Directive, Input, ElementRef, Inject } from '@angular/core';
import { InitiativeNode } from './initiative.component'
import { TreeComponent } from 'angular2-tree-component';
import { DataService } from '../services/data.service';
import { FocusDirective } from '../directives/focus.directive'
import 'rxjs/add/operator/map'


@Component({
    selector: 'building',
    templateUrl: 'building.component.html',
    styles: [require('./building.component.css').toString()]
})

export class BuildingComponent implements OnInit {

    //private root:InitiativeNode;
    private nodes: Array<InitiativeNode>;

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    private dataService: DataService;

    constructor(dataService: DataService) {
        this.dataService = dataService;
        this.nodes = [];
    }


    saveNodeName(newName: any, node: InitiativeNode) {
        node.name = newName;
        this.saveData();
    }

    saveNodeDescription(newDesc: string, node: InitiativeNode) {
        node.description = newDesc;
        this.saveData();
    }

    saveNodeSize(newSize: number, node: InitiativeNode) {
        node.size = newSize;
        this.saveData();
    }

    saveData() {
        // console.log("SAVE HERE");
        // console.log(JSON.stringify(this.nodes));
        this.dataService.setData(this.nodes[0]);
    }

    updateTreeModel(): void {
        // console.log("UPdate");
        // console.log(JSON.stringify(this.nodes));
        this.tree.treeModel.update();
    }

    addChildNode(node: InitiativeNode) {
        let treeNode = this.tree.treeModel.getNodeById(node.id);
        let newNode = new InitiativeNode(null);
        newNode.children = []
        newNode.hasFocus = true;
        setTimeout(() => { newNode.hasFocus = false });
        treeNode.data.children.push(newNode);
        this.tree.treeModel.setExpandedNode(treeNode, true);
        this.updateTreeModel();
    }


    removeChildNode(node: InitiativeNode) {
        //remove all children
        this.tree.treeModel.getNodeById(node.id).data.children = [];
        //remove node itself (from parent's children)
        let parent = this.tree.treeModel.getNodeById(node.id).parent;
        let index = parent.data.children.indexOf(node);
        parent.data.children.splice(index, 1);
        this.updateTreeModel();
    }

    toggleNode(node: InitiativeNode) {
        this.tree.treeModel
            .getNodeById(node.id).toggleExpanded();
    }

    initializeTree() {

        let url = '../../../assets/datasets/new.json';
        this.dataService.getRawData(url).then(data => {
            this.nodes = [];
            this.nodes.push(new InitiativeNode(data));
            this.saveData();
        })
    }

    seeNode(node: InitiativeNode) {
        alert("Initiative information: \r\n Not implemented. Try again in a few days ?");
    }


    loadData() {
        let url = '../../../assets/datasets/vestd.json';
        this.dataService.getRawData(url).then(data => {
            this.nodes = [];
            this.nodes.push(new InitiativeNode(data));
            this.saveData();
        })


    }


    ngOnInit(): void {
        // this.initializeTree();
        // this.loadData();
    }



}