import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: '5dc31f858a694a68933be39da586fdbe'
});

const particlesOptions = {
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        value_area: 600
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,

    }
  }
  
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    //console.log(width,height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    //console.log({box});
    this.setState({box: box});
  }
  onInputChange = (event) => {
    //console.log(event.target.value);
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    //console.log('click');
    // At the bottom after declaring model if we use this.state.imageUrl we get error check the link in resources.
    app.models.predict(
    Clarifai.FACE_DETECT_MODEL, 
    this.state.input)
      //.then(
      //function(response) {
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      //},
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      //function(err) {
        //console.log(err);
      //}
    .catch(err => console.log(err));
  } 

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    }
    else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});  
  }
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
         <Particles className='particles' 
            params={particlesOptions}
          />
         <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />
         { route === 'home' 
           ?  <div>
                  <Logo />
                  <Rank />
                  <ImageLinkForm 
                    onInputChange = {this.onInputChange} 
                    onButtonSubmit = {this.onButtonSubmit} 
                  />
                  <FaceRecognition box = {box} imageUrl = {imageUrl} /> 
              </div>  
            : (
                 route === 'signin'
                 ? <SignIn onRouteChange = {this.onRouteChange} />
                 : ( route === 'register'
                     ? <Register onRouteChange = {this.onRouteChange} />
                     : <SignIn onRouteChange = {this.onRouteChange} />
                    ) 
              )      
          }
      </div>
    );
  }  
}

export default App;
