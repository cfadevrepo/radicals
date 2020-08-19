import React from 'react'
import { requireNativeComponent } from 'react-native';
import PropTypes from 'prop-types';

class AndroidCharacterView extends React.Component {

  _onEnd = (event) => {
      if (!this.props.onEnd) {
        return;
      }
      this.props.onEnd(event.nativeEvent)
  }

  render() {
    const nativeProps = {
      ...this.props,
      onEnd: this._onEnd,
    }
    return (
      <AndroidCharacterView
      {...nativeProps}
      />
    )
  }
}

AndroidCharacterView.propTypes = {
  data: PropTypes.string,
  points: PropTypes.string,
  quiz: PropTypes.bool,
  onEnd: PropTypes.func,
};

module.exports = requireNativeComponent('CharacterView', AndroidCharacterView)
