import React from 'react'
import PropTypes from 'prop-types'

const Hello = props => (
  <div>Hello {props.name}</div>
)

Hello.defaultProps = {
  name: 'John Doe1'
}

Hello.propTypes = {
  name: PropTypes.string
}

export default Hello