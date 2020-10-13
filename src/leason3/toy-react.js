const RENDER_TO_DOM = Symbol('render to dom')
export class Component {
    constructor() {
        this._range = null;
        this.state = null
        this.props = Object.create(null)
        this.children = []
    }
    get vdom() {
        return this.render().vdom
    }
    setState(newState) {
        if(this.state === null || typeof this.state !== 'object') {
            this.state = newState;
            this.rerender()
            return ;
        }
        const merge = (oldState, newState) => {
            for (const key in newState) {
                if(oldState[key] !== null && typeof oldState[key] === 'object') {
                    merge(oldState[key], newState[key])
                } else {
                    oldState[key] = newState[key]
                }
            }
        }

        merge(this.state, newState)
        this.rerender()
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
    rerender() {
        this._range.deleteContents()
        this[RENDER_TO_DOM](this._range)
    }
}
class ElementNodeWrapper extends Component{
    constructor(tag) {
        super(tag)
        this.type = tag
    }
    get vdom() {
        return {
            type: this.type,
            props: this.props,
            children: this.children.map(child => child.vdom)
        }
    }
    [RENDER_TO_DOM](range) {
        const root = document.createElement(this.type);

        // setAttribute
        for (const name in this.props) {
            const value = this.props[name]
            if(name.match(/^on([\s\S]+)/)) {
                const eventName = RegExp.$1.replace(/([\s\S])/,c => c.toLocaleLowerCase())
                root.addEventListener(eventName, value, false)
                continue 
            }
            if (name === 'className') {
                root.setAttribute('class',value);
                continue
            }
            root.setAttribute(name,value);
        }

        // appendChild
        for (const child of this.children) {
            const childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)
            child[RENDER_TO_DOM](childRange)
        }

        range.deleteContents()
        range.insertNode(root)
    }
}

class TextNodeWrapper extends Component{
    constructor(content) {
        super();
        this.type = '#text'
        this.content = content
    }
    get vdom() {
        return {
            type: this.type,
            content: this.content
        }
    }
    [RENDER_TO_DOM](range) {
        const root = document.createTextNode(this.content)
        range.deleteContents()
        range.insertNode(root)
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
            if(child === null) {
                continue;
            }
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