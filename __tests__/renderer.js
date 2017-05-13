/* global describe it */

import React, { Component } from 'react'
import renderer from 'react-test-renderer'

import { renderFromObject, Renderer } from '../src/renderer'

const Fallback = () => <span>fallback!</span>
const Text = ({ value }) => <span>{value}</span>
const View = ({ children }) => <div>{children}</div>

const components = { Text, View }

const tree1 = {
  type: 'Test',
  props: {
    children: ['test'],
  },
}

const tree2 = {
  type: 'View',
  props: {
    children: [
      {
        type: 'Text',
        props: {
          key: 'text',
          value: 'hello',
          children: ['world'],
        },
      },
      {
        type: 'Image',
        props: {
          key: 'img',
          source: 'URI',
        },
      },
    ],
  },
}

describe('renderFromObject()', () => {
  it('returns the default fallback if no components and fallback are provided', () => {
    expect(renderFromObject(tree1)).toMatchSnapshot()
  })

  it('applies the provided components and fallback', () => {
    expect(
      renderFromObject(tree2, {
        components,
        fallback: Fallback,
      }),
    ).toMatchSnapshot()
  })
})

describe('Renderer', () => {
  it('returns null if no components and fallback are provided', () => {
    const tree = renderer.create(<Renderer tree={tree1} />).toJSON()
    expect(tree).toBe(null)
  })

  it('returns the processed tree', () => {
    const tree = renderer
      .create(
        <Renderer tree={tree2} components={components} fallback={Fallback} />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('parses and renders the provided JSON string', () => {
    const json = JSON.stringify(tree1)
    const tree = renderer
      .create(<Renderer json={json} components={{ Test: View }} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
