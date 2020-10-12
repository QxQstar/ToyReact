import {Component, renderDom, createElement} from './toy-react.js'

class MyComponent extends Component{
    render() {
// 在 jsx 中，使用 {} 扩起来的内容，在 @babel/plugin-transform-react-jsx 插件将 jsx 转成 js 函数调用的时候会将 {} 中的内容取出来当作 createElement 的参数，没有被 {} 包含的内容会被当作字符串作为 createElement 的参数
        return (
            <div>
                <h1>my component</h1>
                {this.children}
            </div>
        )
    }
}

class Min extends Component {
    render() {
        return (
             <h2>H2</h2>
        );
    }
}

renderDom(
    <MyComponent id='MyDiv' class='my-div'>
        <div>ddd</div>
        <Min></Min>
    </MyComponent>,
    document.body
)