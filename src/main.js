import {Component, renderDom, createElement} from './toy-react.js'

class MyComponent extends Component{
    render() {
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