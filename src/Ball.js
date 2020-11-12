import React, {Component} from 'react';
import { View, Animated } from 'react-native';


class Ball extends Component {
    componentWillMount(){
        this.position = new Animated.ValueXY(0, 0); //starting position value
        Animated.spring(this.position, {            //change position..
            toValue : {x : 200, y: 500}             //end position value
        }).start();
    }
    
    render(){
        return (
            <Animated.View style={this.position.getLayout()}>
                <View style={styles.ball}/>
            </Animated.View>
        )
    }
}


const styles = {
    ball : {
        height : 60,
        width : 60,
        borderRadius : 30,
        borderWidth : 30,
        borderColor : 'black'
    }
};


export default Ball;