// @flow

import React, { Children, type Element } from 'react'

import type {
  ConvertedChild,
  ConvertedChildren,
  ConvertedElement,
  ElementChild,
  ElementChildren,
  ElementProps,
} from './types'

type ComponentMetaType = 'function' | 'string' | 'unknown'
type ComponentMeta = {
  name: string,
  type: ComponentMetaType,
}

type ConvertParams = {
  processMeta?: (tree: Element<any>) => ComponentMeta,
  processProps?: (props: Object) => Object,
}

const defaultProcessMeta = (tree: Element<any>) => {
  let name, type
  if (typeof tree.type === 'string') {
    name = tree.type
    type = 'string'
  } else if (typeof tree.type === 'function') {
    name = tree.type.displayName || tree.type.name || 'Unknown'
    type = 'function'
  } else {
    name = 'Unknown'
    type = 'unknown'
  }
  return { name, type }
}

const defaultProcessProps = (props: Object) => props

export const convertToObject = (
  tree: Element<any>,
  params?: ConvertParams = {},
): ConvertedElement => {
  const processMeta = params.processMeta || defaultProcessMeta
  const processProps = params.processProps || defaultProcessProps

  const convertChild = (child: ElementChild): ConvertedChild => {
    if (child == null) {
      return
    }
    if (
      typeof child === 'boolean' ||
      typeof child === 'number' ||
      typeof child === 'string'
    ) {
      return child
    }
    if (child.type) {
      return convertComponent(child)
    }
  }

  const convertChildren = (children: ElementChildren): ConvertedChildren => {
    return Array.isArray(children)
      ? Children.map(children, convertChild)
      : convertChild(children)
  }

  const convertComponent = (tree: Element<any>, key?: string) => {
    if (typeof tree.key === 'string') {
      key = tree.key
    }

    const { name, type } = processMeta(tree)
    if (type === 'unknown') {
      return {
        type: 'Unsupported',
        props: {
          children: [],
        },
      }
    }

    const props = processProps(tree.props)
    if (type === 'function') {
      return convertComponent(tree.type(props), key)
    }

    const children = convertChildren(props.children)
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
  tree: Element<any>,
  params?: ConvertJSONParams = {},
): string => {
  const { space, ...convertParams } = params
  return JSON.stringify(convertToObject(tree, convertParams), null, space)
}
