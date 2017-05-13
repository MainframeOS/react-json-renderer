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
    : convertChild(children)
}

export const convertToObject = (tree: ComponentConfig): ConvertedComponent => {
  const { children, ...props } = tree.props
  if (typeof tree.key === 'string') {
    props.key = tree.key
  }

  if (typeof tree.type === 'string') {
    return {
      type: tree.type,
      props: {
        ...props,
        children: convertChildren(children),
      },
    }
  }
  if (
    typeof tree.type.prototype === 'object' &&
    tree.type.prototype &&
    tree.type.prototype.isReactComponent
  ) {
    const instance = new tree.type(tree.props)
    return {
      type: tree.type.displayName || tree.type.name,
      props: {
        ...props,
        children: convertChildren(instance.render()),
      },
    }
  }
  if (typeof tree.type === 'function') {
    return {
      type: tree.type.displayName || tree.type.name || 'Unknown',
      props: {
        ...props,
        children: convertChildren(tree.type(tree.props)),
      },
    }
  }
  return {
    type: 'Unsupported',
    props: {
      children: [],
    },
  }
}

export const convertToJSON = (
  tree: ComponentConfig,
  space?: number | string,
): string => {
  return JSON.stringify(convertToObject(tree), null, space)
}
