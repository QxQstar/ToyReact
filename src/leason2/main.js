import {Component, renderDom, createElement} from './toy-react.js'

class MyComponent extends Component{
    constructor() {
        super()
        this.state = {
            a:1,
            b:2
        }
        this.onPlus = this.onPlus.bind(this)
    }
    onPlus(){
        this.setState({
            a: this.state.a + 1
        })
    }
    render() {
        return (
            <div>
                <h1>MyComponent</h1>
                {this.state.a.toLocaleString()}
                <button onClick={this.onPlus}>加</button>
                <span className='b-show'>b: {this.state.b.toLocaleString()}</span>
            </div>
        )
    }
}
class Min extends Component {
    render() {
        return (
            <p>min</p>
       );
    }
}
renderDom(
    <MyComponent/>,
    document.body
)