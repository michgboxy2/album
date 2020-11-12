import React, {Component} from 'react';
import {
    View, 
    Animated, 
    PanResponder,
    Dimensions,    //used to get the width and height of the screen
    LayoutAnimation,
    UIManager
} from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;  //get screen width of the device
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;          //limit of drag before a call to action event is triggered
const SWIPE_OUT_DURATION = 200;


class Deck extends Component {
    static defaultProps = {
        onSwipeRight : () => {},
        onSwipeLeft : () => {}
    }


    constructor(props){
        super(props);

        const position = new Animated.ValueXY();
        PanResponder2 = PanResponder.create({
            onStartShouldSetPanResponder : () => true,  //true triggers the user touch event  //on touch lifecycle
            onPanResponderMove : (event, gesture) => {
                position.setValue({x:gesture.dx, y: gesture.dy});            //set position moved to  //?where is it moving to
            },               //on move event
            onPanResponderRelease: (event, gesture) => {              ////on release/let go by user
                if (gesture.dx > SWIPE_THRESHOLD){
                    this.forceSwipe('right');
                } else if ( gesture.dx < -SWIPE_THRESHOLD){
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                } 
                
            }             

        });

        this.PanResponder = PanResponder2;
        this.state = { PanResponder2, position, index : 0};
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.data !== this.props.data){  //re-renders set of decks when i'm done swiping through the list 
            this.setState({index : 0});
        }

    }

    componentWillUpdate(){
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring(); //tells react-native that next time the component re-renders, layout should spring up.
    }

    
    
    forceSwipe(direction){
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: {x, y: 0 },
            duration : SWIPE_OUT_DURATION                      //number of milliseconds for the animation to play out
        
        }).start(() => this.onSwipeComplete(direction)); 
    }

    
    onSwipeComplete(direction){
        const { onSwipeRight, onSwipeLeft, data} = this.props;
        const item = data[this.state.index];

        direction === 'right'? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({x:0, y: 0});
        this.setState({index : this.state.index + 1});
    }

    
    resetPosition(){                                   //reset position on drag release
        Animated.spring(this.state.position, {
            toValue: {x: 0, y: 0}
        }).start();
    }

    
    getCardsStyle(){
        const {position} = this.state;

        const rotate = position.x.interpolate({   //set rotation with respect to the angle of card drag
            inputRange : [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],        //input is the range of drag, output range is how distorted it is on the screen.
            outputRange : ['-120deg', '0deg', '120deg']
        });

        return {
            ...this.state.position.getLayout(),
            transform : [{rotate}]   //rotate card
        }
    }


    renderCards(){
        //handle empty card list after all card have been swiped through
        if(this.state.index >= this.props.data.length){
            return this.props.renderNoMoreCards();
        }




        return this.props.data.map((item, i) => {
            if(i < this.state.index){ return null;}



            if(i === this.state.index){
                return (
                    <Animated.View
                    key={item.id}
                    style={[this.getCardsStyle(), styles.cardStyle]}
                    {...this.state.PanResponder2.panHandlers}
                    
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }
            return (
                <Animated.View 
                key={item.id} style={[styles.cardStyle, { top : 10 * ( i - this.state.index) }]}>
                {this.props.renderCard(item)}
                </Animated.View>
            );

        })
        .reverse();
    }
    
    
    
    render() {
        
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

const styles = {
    cardStyle : {
        position : 'absolute',
        width : SCREEN_WIDTH
    }
}


export default Deck;