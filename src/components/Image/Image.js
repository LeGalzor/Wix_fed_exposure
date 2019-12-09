import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "./Image.scss";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.handleMirroring = this.handleMirroring.bind(this);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      mirrored: false,
      clone: 1
    };
  }

  handleMirroring() {
    this.setState({ mirrored: !this.state.mirrored });
  }

  handleClone() {
    this.setState({ clone: this.state.clone++ });
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = galleryWidth / imagesPerRow;
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  onClone() {
    this.props.callBack(this.props.dto);
  }

  onModalOpen() {
    let dto = this.props.dto;
    let img = `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
    this.props.openModal(img);
  }

  render() {
    let div_class = this.state.mirrored ? "image-mirrored" : "image-root";
    let imgUrl = `url(${this.urlFromDto(this.props.dto)})`;
    return (
      <div
        className={div_class}
        style={{
          backgroundImage: imgUrl,
          width: this.state.size + "px",
          height: this.state.size + "px"
        }}
      >
        <div>
          <FontAwesome
            onClick={this.handleMirroring}
            className="image-icon"
            name="arrows-alt-h"
            title="flip"
          />
          <FontAwesome
            onClick={this.onClone.bind(this)}
            className="image-icon"
            name="clone"
            title="clone"
          />
          <FontAwesome onClick={this.onModalOpen.bind(this)} className="image-icon" name="expand" title="expand" />
        </div>
      </div>
    );
  }
}

export default Image;
