// @flow

import React from 'react'

import type {
  ComponentChild,
  ComponentChildren,
  ComponentConfig,
  ConvertedChild,
  ConvertedChildren,
  ConvertedComponent,
} from './types'

export const convertChild = (child: ComponentChild): ConvertedChild => {
  if (child == null) {
    return
  }
  if (typeof child === 'string') {
    return child
  }
  if (child.type) {
    return convertToObject(child)
  }
}

export const convertChildren = (
  children: ComponentChildren,
): ConvertedChildren => {
  return Array.isArray(children)
    ? children.map(convertChild)
    : [convertChild(children)]
}

export const convertToObject = (tree: ComponentConfig): ConvertedComponent => {
  let type
  if (typeof tree.type === 'string') {
    type = tree.type
  } else if (tree.type.displayName) {
    type = tree.type.displayName
  } else if (tree.type.name) {
    type = tree.type.name
  }
  const { children, ...props } = tree.props
  return {
    type,
    props: {
      ...props,
      children: convertChildren(children),
    },
  }
}

export const renderToJSON = (
  tree: ComponentConfig,
  space?: number | string,
): string => {
  return JSON.stringify(convertToObject(tree), null, space)
}
