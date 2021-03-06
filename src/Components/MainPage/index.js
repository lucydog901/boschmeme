import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, NavbarBrand } from 'reactstrap';

const photos = [
  { src: '/images/layer2.png' },
  { src: '/images/layer12.png' },
  { src: '/images/layer14.png' },
  { src: '/images/layer7.png' },
  { src: '/images/layer8.png' },
  { src: '/images/layer9.png' },
  { src: '/images/layer10.png' },
  { src: '/images/layer26.png' },
  { src: '/images/layer21.png' },
  { src: '/images/layer16.png' },
  { src: '/images/layer15.png' },
  { src: '/images/layer22.png' },
  { src: '/images/layer17.png' },
  { src: '/images/layer20.png' },
  { src: '/images/layer1.png' },
  { src: '/images/layer24.png' },
  { src: '/images/layer23.png' },
  { src: '/images/layer3.png' },
  { src: '/images/layer19.png' },
  { src: '/images/layer11.png' }
];

const initialState = {
  toptext: "",
  bottomtext: "",
  isTopDragging: false,
  isBottomDragging: false,
  topY: "10%",
  topX: "50%",
  bottomX: "50%",
  bottomY: "90%"
}

class MainPage extends React.Component {
  constructor() {
    super();
    this.state = {
      currentImage: 0,
      modalIsOpen: false,
      currentImagebase64: null,
      ...initialState
    };
  }

  openImage = (index) => {
    const image = photos[index];
    const base_image = new Image();
    base_image.src = image.src;
    const base64 = this.getBase64Image(base_image);
    this.setState(prevState => ({
      currentImage: index,
      modalIsOpen: !prevState.modalIsOpen,
      currentImagebase64: base64,
      ...initialState
    }));
  }

  toggle = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen
    }));
  }

  changeText = (event) => {
    this.setState({
      [event.currentTarget.name]: event.currentTarget.value
    });
  }

  getStateObj = (e, type) => {
    let rect = this.imageRef.getBoundingClientRect();
    const xOffset = e.clientX - rect.left;
    const yOffset = e.clientY - rect.top;
    let stateObj = {};
    if (type === "bottom") {
      stateObj = {
        isBottomDragging: true,
        isTopDragging: false,
        bottomX: `${xOffset}px`,
        bottomY: `${yOffset}px`
      }
    } else if (type === "top") {
      stateObj = {
        isTopDragging: true,
        isBottomDragging: false,
        topX: `${xOffset}px`,
        topY: `${yOffset}px`
      }
    }
    return stateObj;
  }

  handleMouseDown = (e, type) => {
    const stateObj = this.getStateObj(e, type);
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event, type));
    this.setState({
      ...stateObj
    })
  }

  handleMouseMove = (e, type) => {
    if (this.state.isTopDragging || this.state.isBottomDragging) {
      let stateObj = {};
      if (type === "bottom" && this.state.isBottomDragging) {
        stateObj = this.getStateObj(e, type);
      } else if (type === "top" && this.state.isTopDragging){
        stateObj = this.getStateObj(e, type);
      }
      this.setState({
        ...stateObj
      });
    }
  };

  handleMouseUp = (event) => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.setState({
      isTopDragging: false,
      isBottomDragging: false
    });
  }

  convertSvgToImage = () => {
    const svg = this.svgRef;
    let svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    const img = document.createElement("img");
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = function() {
      canvas.getContext("2d").drawImage(img, 0, 0);
      const canvasdata = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "meme.png";
      a.href = canvasdata;
      document.body.appendChild(a);
      a.click();
    };
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  render() {
    const image = photos[this.state.currentImage];
    const base_image = new Image();
    base_image.src = image.src;
    var wrh = base_image.width / base_image.height;
    var newWidth = 400;
    var newHeight = newWidth / wrh;
    const textStyle = {
      fontFamily: "Impact",
      fontSize: "30px",
      textTransform: "uppercase",
      fill: "#FFF",
      stroke: "#000",
      userSelect: "none"
    }

    return (
      <div>
        <div className="main-content">
        
          <div className="sidebar">
          
            <NavbarBrand href="/"><img src="/images/logo.png" alt="logo"></img></NavbarBrand>
            
            <p>
            Create and download your own dank Hieronymus Bosch memes (Hieromemus Dankemus). 
            </p>
            <p>
            Choose a character from Bosch's painting  <a href="https://en.wikipedia.org/wiki/The_Garden_of_Earthly_Delights?fbclid=IwAR3GpoUPMcZ3UJn76Zh2fUbN_5n_a3uUMenxgi6cbd00BiZlxy1CWks_-Vk#/media/File:The_Garden_of_earthly_delights.jpg" target="_blank" rel="noopener noreferrer"><i>The Garden of Earthly Delights</i></a> and enter up to two lines of text, then click and drag to place your text anywhere on the canvas.
            </p>
            <p><i>Mobile Users:</i> The ability to drag and drop text is not available on touch devices. The first line of text will appear at the the top of the meme, and the second line will appear at the bottom.</p>
          </div>
          <div className="content">
            {photos.map((image, index) => (
              <div className="image-holder" key={image.src}>
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    height: "100%"
                  }}
                  alt={index}
                  src={image.src}
                  onClick={() => this.openImage(index)}
                  role="presentation"
                />
              </div>
            ))}
            <div className="container"> <br></br>
            <h5><span>&#169;</span> Thomasin Durgin 2021.</h5>
            </div>
          </div>
        </div>
        <Modal className="meme-gen-modal" isOpen={this.state.modalIsOpen}>
          <ModalHeader toggle={this.toggle}>Bosch Meme</ModalHeader>
          <ModalBody>
      
            <svg
              width={newWidth}
              id="svg_ref"
              height={newHeight}
              ref={el => { this.svgRef = el }}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink">
              <image
                ref={el => { this.imageRef = el }}
                xlinkHref={this.state.currentImagebase64}
                height={newHeight}
                width={newWidth}
              />
              <text
                style={{ ...textStyle, zIndex: this.state.isTopDragging ? 4 : 1 }}
                x={this.state.topX}
                y={this.state.topY}
                dominantBaseline="middle"
                textAnchor="middle"
                onMouseDown={event => this.handleMouseDown(event, 'top')}
                onMouseUp={event => this.handleMouseUp(event, 'top')}
              >
                  {this.state.toptext}
              </text>
              <text
                style={textStyle}
                dominantBaseline="middle"
                textAnchor="middle"
                x={this.state.bottomX}
                y={this.state.bottomY}
                onMouseDown={event => this.handleMouseDown(event, 'bottom')}
                onMouseUp={event => this.handleMouseUp(event, 'bottom')}
              >
                  {this.state.bottomtext}
              </text>
            </svg>
            </ModalBody>
            <ModalFooter>
            <div className="meme-form">
              <FormGroup>
                <Label for="toptext">First Line of Text</Label>
                <input className="form-control" type="text" name="toptext" id="toptext" placeholder="add text" onChange={this.changeText} />
              </FormGroup>
              <FormGroup>
                <Label for="bottomtext">Second Line of Text</Label>
                <input className="form-control" type="text" name="bottomtext" id="bottomtext" placeholder="add text" onChange={this.changeText} />
              </FormGroup>
              <button onClick={() => this.convertSvgToImage()} className="btn btn-primary">Download</button>
            </div>
         </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default MainPage;
