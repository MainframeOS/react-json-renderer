// @flow

import React, { createElement, PureComponent, type ComponentType } from 'react'

import type { ConvertedElement } from './types'

type RenderParams = {
  components?: { [type: string]: ComponentType<*> },
  fallback?: ComponentType<*>,
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
    if (Array.isArray(c)) {
      return c.map(createChild)
    }
    if (
      typeof c === 'boolean' ||
      typeof c === 'number' ||
      typeof c === 'string'
    ) {
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
    if (children != null) {
      props.children = createChild(children)
    }
    return createElement(component, props)
  }

  return createFromObject(tree)
}

type RendererProps = {
  json?: string,
  tree?: ConvertedElement,
} & RenderParams

export class Renderer extends PureComponent<RendererProps> {
  props: RendererProps

  render() {
    const { json, tree, ...params } = this.props
    let obj
    if (tree) obj = tree
    else if (json) obj = JSON.parse(json) // flowlint-line sketchy-null-string:off

    return obj ? renderFromObject(obj, params) : null
  }
}
