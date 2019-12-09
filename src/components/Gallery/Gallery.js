import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import "./Gallery.scss";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      modalIsOpen: false,
      modalImage: ''
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(img) {
    this.setState({ modalIsOpen: true, modalImage: img });
    // debugger;
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1`;
    const baseUrl = "https://api.flickr.com/";
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: "GET"
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({ images: res.photos.photo });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }
  clone(img) {
    let prevState = this.state.images;
    prevState.splice(0, 0, img);
    this.setState({ images: prevState });
  }

  render() {
    return (
      <div className="gallery-root">
        <Modal
          appElement={document.getElementById("app")}
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Example Modal"
        >
          <img src={this.state.modalImage}
          ></img>
        </Modal>
        {this.state.images.map((dto, index) => {
          return (
            <Image
              key={"image-" + dto.id + index}
              dto={dto}
              callBack={this.clone.bind(this)}
              openModal={this.openModal.bind(this)}
              galleryWidth={this.state.galleryWidth}
            />
          );
        })}
      </div>
    );
  }
}

export default Gallery;
