/* global describe it */

import React, { Component } from 'react'

import {
  convertChild,
  convertChildren,
  convertToObject,
  convertToJSON,
} from '../src/converter'

describe('convertChild()', () => {
  it('returns undefined if the child is undefined', () => {
    expect(convertChild()).toBeUndefined()
  })

  it('returns undefined if the child is null', () => {
    expect(convertChild(null)).toBeUndefined()
  })

  it('returns undefined if the child is undefined', () => {
    expect(convertChild()).toBeUndefined()
  })

  it('returns the child if the child is a string', () => {
    expect(convertChild('test')).toBe('test')
  })

  it('returns the converted component if the child is an object with type', () => {
    expect(
      convertChild({
        type: 'test',
        props: {
          hello: 'world',
        },
        extra: 'whatever',
      }),
    ).toEqual({
      type: 'test',
      props: {
        hello: 'world',
        children: undefined,
      },
    })
  })
})

describe('convertChildren()', () => {
  it('returns an array of children if an array is provided', () => {
    expect(convertChildren(['test', null])).toEqual(['test', undefined])
  })

  it('returns a single child if a single child is provided', () => {
    expect(convertChildren('test')).toEqual('test')
  })

  it('returns undefined the child is nullish', () => {
    expect(convertChildren(null)).toBeUndefined()
  })
})

describe('convertToObject', () => {
  const Child = ({ text }) => text

  it('accepts as string as type', () => {
    expect(
      convertToObject({
        type: 'Wrapper',
        props: {
          children: <Child text="test" />,
        },
      }),
    ).toEqual({
      type: 'Wrapper',
      props: {
        children: {
          type: 'Child',
          props: {
            text: 'test',
            children: 'test',
          },
        },
      },
    })
  })

  it('accepts a React class as type', () => {
    class Wrapper extends Component {
      render() {
        return <Child text={`wrapped ${this.props.text}`} />
      }
    }
    expect(
      convertToObject({
        type: Wrapper,
        props: {
          text: 'test',
        },
      }),
    ).toEqual({
      type: 'Wrapper',
      props: {
        text: 'test',
        children: {
          type: 'Child',
          props: {
            text: 'wrapped test',
            children: 'wrapped test',
          },
        },
      },
    })
  })

  it('accepts a stateless function as type', () => {
    const Parent = () => <Child text="from parent" />
    expect(
      convertToObject({
        type: Parent,
        props: {},
      }),
    ).toEqual({
      type: 'Parent',
      props: {
        children: {
          type: 'Child',
          props: {
            text: 'from parent',
            children: 'from parent',
          },
        },
      },
    })
  })

  it('returns an unsupported component with empty props if the type is unknow', () => {
    expect(
      convertToObject({
        type: 1,
        props: {
          hello: 'world',
          children: ['hello', 'world'],
        },
      }),
    ).toEqual({
      type: 'Unsupported',
      props: {
        children: [],
      },
    })
  })
})
