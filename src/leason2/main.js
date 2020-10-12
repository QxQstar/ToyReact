import {Component, renderDom, createElement} from './toy-react.js'

class MyComponent extends Component{
    render() {
        return (
            <div>
                <h1>my component33</h1>
                <p>ddd</p>
                <p>ddd</p>
                <p>ddd</p>
                <Min/>
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