// @flow

import React from 'react'

import type {
  ComponentChild,
  ComponentChildren,
  ComponentConfig,
  ComponentProps,
  ComponentType,
  ConvertedChild,
  ConvertedChildren,
  ConvertedComponent,
  ReactComponent,
} from './types'

type Replacer = (props: ComponentProps) => ComponentConfig
type ConvertParams = {
  replacers?: { [key: string]: Replacer },
}

export const convertToObject = (
  tree: ComponentConfig,
  params?: ConvertParams = {},
): ConvertedComponent => {
  const replacers = params.replacers || {}

  const convertChild = (child: ComponentChild): ConvertedChild => {
    if (child == null) {
      return
    }
    if (typeof child === 'string') {
      return child
    }
    if (child.type) {
      return convertComponent(child)
    }
  }

  const convertChildren = (children: ComponentChildren): ConvertedChildren => {
    return Array.isArray(children)
      ? children.map(convertChild)
      : convertChild(children)
  }

  const convertComponent = (tree: ComponentConfig, key?: string) => {
    if (typeof tree.key === 'string') {
      key = tree.key
    }

    let name, type
    if (typeof tree.type === 'string') {
      name = tree.type
      type = 'string'
    } else if (
      typeof tree.type.prototype === 'object' &&
      tree.type.prototype &&
      tree.type.prototype.isReactComponent
    ) {
      name = tree.type.displayName || tree.type.name
      type = 'class'
    } else if (typeof tree.type === 'function') {
      name = tree.type.displayName || tree.type.name || 'Unknown'
      type = 'function'
    } else {
      return {
        type: 'Unsupported',
        props: {
          children: [],
        },
      }
    }

    const replacer = replacers[name]
    if (replacer) {
      return convertComponent(replacer(tree.props), key)
    }

    let children
    if (type === 'string') {
      children = convertChildren(tree.props.children)
    } else if (type === 'function') {
      children = convertChildren(tree.type(tree.props))
    } else if (type === 'class') {
      const instance = new tree.type(tree.props)
      children = convertChildren(instance.render())
    }

    return {
      type: name,
      props: { ...tree.props, children, key },
    }
  }

  return convertComponent(tree)
}

type ConvertJSONParams = ConvertParams & {
  space?: number | string,
}

export const convertToJSON = (
  tree: ComponentConfig,
  params?: ConvertJSONParams = {},
): string => {
  const { space, ...convertParams } = params
  return JSON.stringify(convertToObject(tree, convertParams), null, space)
}
