class ElementNodeWrapper {
    constructor(tag) {
        this.root = document.createElement(tag);
    }
    setAttribute(name,value) {
        this.root.setAttribute(name,value);
    }
    appendChild(component) {
        this.root.appendChild(component.root)
    }

}

class TextNodeWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
}

export class Component {
    constructor() {
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
    get root() {
        if(!this._root) {
            this._root = this.render().root
        }
        return this._root;
    }
}

export function renderDom(compnent, parent) {
    parent.appendChild(compnent.root)
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