import React from 'react'

import "./css/count_down.css"

import secondsToTime from '../../../utils/seconds_to_time'


export default class CountDown extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          time: {},
          seconds: this.props.seconds
        };
    }
    
    componentDidMount() {
        // Старт после рендера
        this.countDown() 
    }
    
    componentWillUnmount() {
      console.log(this.timer);
      clearInterval(this.timer);
    }
      
    countDown() {
      let seconds = this.state.seconds

      this.setState({
        time: secondsToTime(seconds),
        seconds: seconds
      });

      this.timer = setInterval(
        () => {
          seconds = this.state.seconds - 1;
          
          // Check if we're at zero.
          if (seconds === 0) { 
            clearInterval(this.timer);
          }else {
            this.setState({
              time: secondsToTime(seconds),
              seconds: seconds
            });
          }

          this.props.setTime(seconds)

        }, 1000
      )  
    }
  
    render() {
      return ( 
          <p className="registration__form__countdown-timer">Повторная отправка доступна через: {this.state.time.m}:{this.state.time.s}</p>
      );
    }
  }