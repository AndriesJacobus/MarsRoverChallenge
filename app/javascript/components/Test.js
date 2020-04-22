import React from "react"
import PropTypes from "prop-types"
class Test extends React.Component {
  render () {
    return (
      <React.Fragment>
        Content: {this.props.content}
      </React.Fragment>
    );
  }
}

Test.propTypes = {
  content: PropTypes.string
};
export default Test
