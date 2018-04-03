/* global it */

import React, { Component, Fragment } from 'react'
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
  const View = 'View'

  const Header = ({ title, ...props }) => (
    <View {...props} type="header">
      <Text>{title}</Text>
    </View>
  )
  const Wrapper = ({ children }) => <View type="wrapper">{children}</View>

  const json = convertToJSON(
    <Wrapper>
      <Header key="header" title="Title" />
      <View key="contents" type="main">
        <Text>Contents</Text>
      </View>
    </Wrapper>,
    {
      space: 2,
    },
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

it('Fragment works end-to-end', () => {
  const Text = 'Text'

  const json = convertToJSON(
    <Fragment>
      <Text key="1">hello</Text>
      <Text key="2">test</Text>
    </Fragment>,
    { space: 2 },
  )

  const components = {
    Text: ({ children }) => <span className="text">{children}</span>,
  }

  const tree = renderer
    .create(<Renderer components={components} json={json} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
