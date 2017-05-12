// @flow

import React, { createElement, Component } from 'react'

import type { ConvertedComponent } from './types'

type RenderParams = {
  components?: { [type: string]: Component<*, *, *> },
  fallback?: Component<*, *, *>,
}

const Fallback = () => null

export const renderFromObject = (
  tree: ConvertedComponent,
  params: RenderParams,
) => {
  const components = params.components || {}
  const fallback = params.fallback || Fallback

  const createChild = c => {
    if (c == null) {
      return null
    }
    if (typeof c === 'string') {
      return c
    }
    if (c.type) {
      return createComponent(c)
    }
    return null
  }

  const createComponent = (converted: ConvertedComponent) => {
    const component = components[converted.type] || fallback
    const { children, ...props } = converted.props
    if (children) props.children = children.map(createChild)
    return createElement(component, props)
  }

  return createComponent(tree)
}

export class Renderer extends Component {
  props: RenderParams & {
    json?: string,
    tree?: ConvertedComponent,
  }

  render() {
    const { json, tree, ...params } = this.props
    let obj
    if (tree) obj = tree
    else if (json) obj = JSON.parse(json)

    return obj ? renderFromObject(obj, params) : null
  }
}
