import React, {Component} from "react";
import "./App.css"

const  HEIGHT = 10;
const  WIDTH  = 10;

// mapping keycode  for changing direction
const LEFT  = 65; 
const UP    = 87;
const RIGHT = 68; 
const DOWN  = 83;
const STOP  = 32; /* [space] used for pause */

const getRandom = () => {
    return  { 
        x: Math.floor(Math.random() *WIDTH),
        y: Math.floor(Math.random() *HEIGHT) 
    }
}

const emptyRows = () => [...Array(WIDTH)].map((_) => [...Array(HEIGHT)].map((_)=> 'grid-item'));

const increaseSpeed = (speed) => speed - 10 *(speed > 10)

const initialState = {
    rows: emptyRows(),
    snake: [getRandom()],
    food: getRandom(),
    direction: STOP,
    speed: 100,
}

class App extends Component {

    constructor() {
        super();
        this.state = initialState;
    }

    componentDidMount() {
        setInterval(this.moveSnake, this.state.speed);
        document.onkeydown = this.changeDirection;
        document.title = "snake-game";
    }

    componentDidUpdate() {
        this.isCollapsed();
        this.isEaten();
    }

    moveSnake = () => {
        let snakeCopy = [...this.state.snake];
        let head  =  {...snakeCopy[snakeCopy.length-1]};
        switch (this.state.direction) {
            case LEFT:  head.y += -1; break;    
            case UP:    head.x += -1; break;
            case RIGHT: head.y += 1;  break;
            case DOWN:  head.x += 1;  break;
            default: return;
        }
        /* keep the value within range of 0 to HEIGHT */
        head.x += HEIGHT * ((head.x<0)-(head.x>=HEIGHT));
        head.y += WIDTH * ((head.y<0)-(head.y>=WIDTH));
        
        snakeCopy.push(head); 
        snakeCopy.shift()
        this.setState({
            snake: snakeCopy,
            head: head
        });
        this.update(); 
    }   
    
    isEaten() {
        let snakeCopy  = [...this.state.snake];
        let head  =  {...snakeCopy[snakeCopy.length-1]};
        let food = this.state.food;
        if ((head.x === food.x) &&(head.y === food.y)) {
            snakeCopy.push(head);
            this.setState({
                snake: snakeCopy,
                food: getRandom(),
                speed: increaseSpeed(this.state.speed) 
            });
        } 
    }

    update() {
        let newRows = emptyRows(); 
        this.state.snake.forEach(element => newRows[element.x][element.y] = 'snake')
        newRows[this.state.food.x][this.state.food.y] = 'food';
        this.setState({rows: newRows});
    }

    isCollapsed = () => {
        let snake = this.state.snake;
        let head  = {...snake[snake.length-1]} 
        for (let i=0; i<snake.length-3; i++) {
            if ((head.x === snake[i].x) &&(head.y === snake[i].y)) {
                this.setState(initialState);
                alert(`Your empire became too large to be governed effectively! You conquered and united ${snake.length} tribes!`)
            }
        }
    }

    changeDirection = ({keyCode}) => { 
        let direction = this.state.direction;
        switch (keyCode) {
            case LEFT:
                direction = (direction === RIGHT)? RIGHT: LEFT;
                break;
            case RIGHT:
                direction = (direction === LEFT)? LEFT: RIGHT;
                break;
            case UP:
                direction = (direction === DOWN)? DOWN: UP;
                break;
            case DOWN:
                direction = (direction === UP)? UP: DOWN;
                break;
            case STOP:
                direction = STOP;
                break;
            default:
                break;
        }
        this.setState({
            direction: direction
        });
    }    
   
    render() {
        const displayRows = this.state.rows.map((row, i) => row.map((value, j) =>  <div name={`${i}=${j}`} className={value} />))
        return (
            <div className="a">
                <h1> APWH Samuel Rivas extra credit</h1>
                <ul>
                    <li>press "space" to pause the game.</li>
                    <li>press "w,a,s,d" keys to change direction/ unpause.</li>

                    <p> You are the Great Kahn of the Mongol Empire, a nomadic group from the Central Asian steppes! 
                    Consolidate your power and conquer China, India, the Middle East, and the early kingdom of Russia! 
                    Although your invasions may distrupt trade, Kahns before you created the Pax Mongolica to unify all of Asia!
                    Collect tribute from the areas you conquer and command an army of Mongolian Archers. </p>


                </ul>
                <div className="snake-container">
                    <div className="grid">{displayRows}</div>
                </div>
            </div>
        )    
    }
}

export default App;