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
  processProps?: (props: Object) => Object,
  replacers?: { [string]: Replacer },
}

const defaultProcessProps = (props: Object) => props

export const convertToObject = (
  tree: Element<*>,
  params?: ConvertParams = {},
): ConvertedElement => {
  const replacers = params.replacers || {}
  const processProps = params.processProps || defaultProcessProps

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

    const props = processProps(tree.props)

    const replacer = replacers[name]
    if (replacer) {
      return convertComponent(replacer(props), key)
    }

    let children
    if (type === 'string') {
      children = convertChildren(props.children)
    } else if (type === 'function') {
      children = convertChildren(tree.type(props))
    } else if (type === 'class') {
      const instance = new tree.type(props)
      children = convertChildren(instance.render())
    }

    return {
      type: name,
      props: { ...props, children, key },
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
