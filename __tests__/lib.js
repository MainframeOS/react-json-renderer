/* global it */

import React, { Component } from 'react'
import renderer from 'react-test-renderer'

import {
  convertToObject,
  convertToJSON,
  renderFromObject,
  Renderer,
} from '../src'

it('exposes the convertToObject, convertToJSON, renderFromObject and Renderer', () => {
  expect(convertToObject).toBeDefined()
  expect(convertToJSON).toBeDefined()
  expect(renderFromObject).toBeDefined()
  expect(Renderer).toBeDefined()
})

it('works end-to-end', () => {
  const Text = 'Text'
  const View = ({ children }) => children

  const json = convertToJSON(
    <View type="wrapper">
      <View key="header" type="header">
        <Text>Title</Text>
      </View>
      <View key="contents" type="main">
        <Text>Contents</Text>
      </View>
    </View>,
    2,
  )

  const components = {
    Text: ({ children }) => <span className="text">{children}</span>,
    View: ({ children, type }) => (
      <div className={`view view-${type}`}>{children}</div>
    ),
  }

  const tree = renderer
    .create(<Renderer components={components} json={json} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
