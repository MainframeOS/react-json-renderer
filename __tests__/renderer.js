/* global describe it */

import React, { Component, Fragment } from 'react'
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

  it('returns null for unsupported children', () => {
    expect(
      renderFromObject(
        {
          type: 'Text',
          props: { children: ['test', undefined, 2, null, 'other', true] },
        },
        { components },
      ),
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

  it('handles not having props provided', () => {
    const tree = renderer
      .create(
        <Renderer
          tree={{ type: 'View' }}
          components={components}
          fallback={Fallback}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('supports nesting children arrays', () => {
    const tree = renderer
      .create(
        <Renderer
          tree={{
            type: 'View',
            props: {
              children: [
                [{ type: 'Text', props: { key: '1', value: 'Hello' } }],
                [
                  { type: 'Text', props: { key: '2', value: ' nested ' } },
                  [[{ type: 'Text', props: { key: '3', value: 'children' } }]],
                ],
              ],
            },
          }}
          components={components}
          fallback={Fallback}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('supports Fragment', () => {
    const tree = renderer
      .create(
        <Renderer
          tree={{
            type: 'Fragment',
            props: {
              children: [
                { type: 'Text', props: { key: '1', value: 'Hello' } },
                { type: 'Text', props: { key: '2', value: 'world' } },
              ],
            },
          }}
          components={components}
          fallback={Fallback}
        />,
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
