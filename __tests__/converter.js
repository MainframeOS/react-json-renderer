/* global describe it */

import React, { Component } from 'react'

import { convertToObject, convertToJSON } from '../src/converter'

describe('convertToObject', () => {
  const Child = 'Child'

  it('returns undefined children if the child is undefined', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: undefined,
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: undefined,
      },
    })
  })

  it('returns undefined children if the child is null', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: null,
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: undefined,
      },
    })
  })

  it('returns the child as children if the child is a string', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: 'test',
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: 'test',
      },
    })
  })

  it('returns the converted component as children if the child is an object with type', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: {
            type: 'test',
            props: {
              hello: 'world',
            },
            extra: 'whatever',
          },
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: {
          type: 'test',
          props: {
            hello: 'world',
            children: undefined,
          },
        },
      },
    })
  })

  it('returns an array of children if an array is provided', () => {
    expect(
      convertToObject({
        type: 'Test',
        props: {
          children: ['test', null],
        },
      }),
    ).toEqual({
      type: 'Test',
      props: {
        children: ['test'],
      },
    })
  })

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
      type: 'Child',
      props: {
        text: 'from parent',
      },
    })
  })

  it('supports iterating over children', () => {
    const Parent = 'Parent'
    expect(
      convertToObject(
        <Parent>
          {['a', 'b', 'c'].map(n => <Child key={n} />)}
          <Child test />
        </Parent>,
      ),
    ).toEqual({
      type: 'Parent',
      props: {
        children: [
          {
            type: 'Child',
            props: {
              key: 'a',
            },
          },
          {
            type: 'Child',
            props: {
              key: 'b',
            },
          },
          {
            type: 'Child',
            props: {
              key: 'c',
            },
          },
          {
            type: 'Child',
            props: {
              test: true,
            },
          },
        ],
      },
    })
  })

  it('supports nested children arrays', () => {
    const Parent = 'Parent'
    expect(
      convertToObject(
        <Parent>
          {[<Child key="a" test />, <Child key="b" />]}
          {[[<Child key="c" />], <Child key="d" test />, [[<Child key="e" />]]]}
        </Parent>,
      ),
    ).toEqual({
      type: 'Parent',
      props: {
        children: [
          {
            type: 'Child',
            props: {
              key: 'a',
              test: true,
            },
          },
          {
            type: 'Child',
            props: {
              key: 'b',
            },
          },
          {
            type: 'Child',
            props: {
              key: 'c',
            },
          },
          {
            type: 'Child',
            props: {
              key: 'd',
              test: true,
            },
          },
          {
            type: 'Child',
            props: {
              key: 'e',
            },
          },
        ],
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

  it('returns fragments', () => {
    expect(
      convertToObject((
        <React.Fragment>
          <Child key="a" test />
          <Child key="b" />
        </React.Fragment>
      )),
    ).toEqual({
      props: {
        children: [
          {
            type: 'Child',
            props: {
              key: 'a',
              test: true,
            },
          },
          {
            type: 'Child',
            props: {
              key: 'b',
            },
          },
        ]
      },
      type: 'Fragment'
    });
  })

  it('uses the processProps options', () => {
    const processProps = props => {
      if (props.style) {
        props.style = 'processed ' + props.style
      }
      return props
    }

    expect(
      convertToObject(
        {
          type: 'Test',
          props: {
            style: 'test',
            other: 'same',
            children: undefined,
          },
        },
        { processProps },
      ),
    ).toEqual({
      type: 'Test',
      props: {
        style: 'processed test',
        other: 'same',
        children: undefined,
      },
    })
  })
})
