// @flow

import React, { createElement, Component } from 'react'

import type { AnyComponent, ConvertedElement } from './types'

type RenderParams = {
  components?: { [type: string]: AnyComponent },
  fallback?: AnyComponent,
}

const Fallback = () => null

export const renderFromObject = (
  tree: ConvertedElement,
  params?: RenderParams,
) => {
  const components = (params && params.components) || {}
  const fallback = (params && params.fallback) || Fallback

  const createChild = c => {
    if (c == null) {
      return null
    }
    if (typeof c === 'number' || typeof c === 'string') {
      return c
    }
    if (c.type) {
      return createFromObject(c)
    }
    return null
  }

  const createFromObject = (converted: ConvertedElement) => {
    const component = components[converted.type] || fallback

    if (!converted.props) {
      return createElement(component)
    }

    const { children, ...props } = converted.props
    if (children) {
      props.children = Array.isArray(children) // eslint-disable-line react/prop-types
        ? children.map(createChild)
        : createChild(children)
    }
    return createElement(component, props)
  }

  return createFromObject(tree)
}

export class Renderer extends Component {
  props: RenderParams & {
    json?: string,
    tree?: ConvertedElement,
  }

  render() {
    const { json, tree, ...params } = this.props
    let obj
    if (tree) obj = tree
    else if (json) obj = JSON.parse(json)

    return obj ? renderFromObject(obj, params) : null
  }
}
