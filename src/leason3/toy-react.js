const RENDER_TO_DOM = Symbol('render to dom')
export class Component {
    constructor() {
        this._range = null;
        this.state = null;
        // 旧的 vdom
        this._vdom = null;
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
        this.update()
    }
    update() {
        function isSameNode(oldNode, newNode) {
            if(oldNode.type !== newNode.type) {
                return false
            }

            if(newNode.type === '#text' && newNode.content !== oldNode.content) {
                return false
            }

            for (const name in newNode.props) {
                if(oldNode[name] !== newNode[name]) {
                    return false
                }
            }
            if (Object.keys(newNode.props).length < Object.keys(oldNode.props).length) {
                return false
            }

            return true
        }
        const update = (oldNode, newNode) => {
            if (!isSameNode(oldNode, newNode)) {
                newNode[RENDER_TO_DOM](oldNode._range)
                return;
            }
            newNode._range = oldNode._range

            const newChildren = newNode.vChildren;
            const oldChildren = oldNode.vChildren;

            if(!newChildren || newChildren.length === 0) {
                return 
            }
            // 遗留问题：如果 oldChildren 为空数组怎么解决？
            let tailRange = oldChildren[oldChildren.length - 1]._range

            for (let i = 0; i < newChildren.length; i++) {
                let newChild = newChildren[i];
                let oldChild = oldChildren[i];

                if(i < oldChildren.length) {
                    update(oldChild, newChild)
                } 
                // 如果 newChildren 的长度大于 oldChildren的长度
                else { 
                    let range = document.createRange()
                    range.setStart(tailRange.endContainer, tailRange.endOffset);
                    range.setEnd(tailRange.endContainer, tailRange.endOffset);
                    newChild[RENDER_TO_DOM](range)
                    tailRange = range;
                }
            }
        }
        const vdom = this.vdom;
        update(this._vdom,vdom);
        this._vdom = vdom;
    }
    setAttribute(name,value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        this._range = range
        this._vdom = this.vdom;
        this._vdom[RENDER_TO_DOM](range)
    }
}
class ElementNodeWrapper extends Component{
    constructor(tag) {
        super(tag)
        this.type = tag
    }
    get vdom() {
        this.vChildren = this.children.map(child => child.vdom);
        return this;
    }
    [RENDER_TO_DOM](range) {
        const root = document.createElement(this.type);
        range.deleteContents()
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
        if (!this.vChildren) {
            this.children.map(child => child.vdom);
        }
        for (const child of this.vChildren) {
            const childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)
            child[RENDER_TO_DOM](childRange)
        }
        this._range = range;
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
        return this;
    }
    [RENDER_TO_DOM](range) {
        const root = document.createTextNode(this.content)
        range.deleteContents()
        this._range = range;
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