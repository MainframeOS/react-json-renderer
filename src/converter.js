// @flow

import React, { type Element } from 'react'

import type {
  ConvertedChild,
  ConvertedChildren,
  ConvertedElement,
  ElementChild,
  ElementChildren,
  ElementProps,
} from './types'

type Replacer = (props: ElementProps) => Element<*>
type ConvertParams = {
  replacers?: { [string]: Replacer },
}

export const convertToObject = (
  tree: Element<*>,
  params?: ConvertParams = {},
): ConvertedElement => {
  const replacers = params.replacers || {}

  const convertChild = (child: ElementChild): ConvertedChild => {
    if (child == null) {
      return
    }
    if (typeof child === 'number' || typeof child === 'string') {
      return child
    }
    if (child.type) {
      return convertComponent(child)
    }
  }

  const convertChildren = (children: ElementChildren): ConvertedChildren => {
    return Array.isArray(children)
      ? children.map(convertChild)
      : convertChild(children)
  }

  const convertComponent = (tree: Element<*>, key?: string) => {
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
      name = tree.type.displayName || tree.type.name || 'Unknown'
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
  tree: Element<*>,
  params?: ConvertJSONParams = {},
): string => {
  const { space, ...convertParams } = params
  return JSON.stringify(convertToObject(tree, convertParams), null, space)
}
