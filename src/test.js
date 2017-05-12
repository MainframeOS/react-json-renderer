import React from 'react'

import { renderToJSON, renderFromObject } from './index'

const Empty = () => null
const View = ({ children }) => children
const Hello = ({ name }) => `Hello ${name}`
const Placeholder = 'Placeholder'
class ClassComponent extends React.Component {
  render() {
    return this.props.children
  }
}

const tree = (
  <ClassComponent>
    <View style="primary">
      <Empty />
      <Hello name="Bob" />
      <View><Placeholder /></View>
    </View>
  </ClassComponent>
)

const JSONRes = renderToJSON(tree)

const objectRes = JSON.parse(JSONRes)

const components = {
  ClassComponent: ({ children }) => children,
  Empty: () => null,
  View: ({ children }) => children,
  Hello: ({ name }) => `Hello ${name}`,
  Placeholder: () => 'Placeholder text',
}

const res = renderFromObject(objectRes, { components })

console.log('res', res)
