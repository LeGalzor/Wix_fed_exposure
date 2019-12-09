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
      loading: false,
      page: 1,
      galleryWidth: this.getGalleryWidth(),
      modalIsOpen: false,
      modalImage: ''
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(img) {
    this.setState({ modalIsOpen: true, modalImage: img });
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
  getImages(tag, page) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1&page=${page}`;
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

  loadMore() {
    this.setState({ loading: true, page: this.state.page +1 });
    debugger;
    setTimeout(() => {
      const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${this.props.tag}&tag_mode=any&per_page=100&format=json&safe_search=1&nojsoncallback=1&page=${this.state.page}`;
      // eslint-disable-next-line quotes
      const baseUrl = "https://api.flickr.com/";
      axios({
        url: getImagesUrl,
        baseURL: baseUrl,
        method: 'GET'
      })
        .then(res => res.data)
        .then(res => {
          if (
            res &&
            res.photos &&
            res.photos.photo &&
            res.photos.photo.length > 0
          ) {
            let newImages = this.state.images.concat(res.photos.photo);
            this.setState({ images: newImages });
          }
        });
    }, 2000);
  }

  componentDidMount() {
    this.getImages(this.props.tag, this.state.page);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag, this.state.page);
  }
  handleScroll = (e) => {
    debugger;
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) { this.loadMore() }
  }
  clone(img) {
    let prevState = this.state.images;
    prevState.splice(0, 0, img);
    this.setState({ images: prevState });
  }

  render() {
    return (
      <div className="gallery-root" onScroll={this.handleScroll}>
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
        {this.state.loading
	      ? <p className="App-intro">
		  loading ...
		</p>
	      : ""}
      </div>
    );
  }
}

export default Gallery;
