const RENDER_TO_DOM = Symbol('render to dom')

class ElementNodeWrapper {
    constructor(tag) {
        this.root = document.createElement(tag);
    }
    setAttribute(name,value) {
        this.root.setAttribute(name,value);
    }
    appendChild(component) {
        const range = document.createRange()
        range.setStart(this.root, this.root.childNodes.length)
        range.setEnd(this.root,this.root.childNodes.length)
        component[RENDER_TO_DOM](range)
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }

}

class TextNodeWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

export class Component {
    constructor() {
        this._range = null;
        this.props = Object.create(null)
        this.children = []
        this._root = null
    }
    setAttribute(name,value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        this._range = range
        this.render()[RENDER_TO_DOM](range)
    }
}

export function renderDom(compnent, parent) {
    const range = document.createRange()
    range.setStart(parent,0)
    range.setEnd(parent,parent.childNodes.length)
    range.deleteContents()
    compnent[RENDER_TO_DOM](range)
}

export function createElement(type,attrs,...children) {
    let component;
    if(typeof type === 'string') {
        component = new ElementNodeWrapper(type)
    } else {
        component = new type()
    }
    
    for(const attrName in attrs) {
        component.setAttribute(attrName, attrs[attrName])
    }
    function insertChildren(children) {
        for(let child of children) {
            if(typeof child === 'string') {
                child = new TextNodeWrapper(child)
            }
            if(Array.isArray(child)) {
                insertChildren(child)
            } else {
                component.appendChild(child)
            }
        }
    }
    insertChildren(children)
    return component
}