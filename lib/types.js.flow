// @flow

import type { Component, Element } from 'react'

export type FunctionComponent = (props: Object) => Element<*>

export type ClassComponent = Class<Component<*, *, *>>

export type AnyComponent = FunctionComponent | ClassComponent

export type ElementChild = void | number | string | Element<*>

export type ElementChildren = ElementChild | Array<ElementChild>

export type ElementProps = {
  children?: ElementChildren,
  [key: string]: mixed,
}

export type ConvertedChild = void | number | string | ConvertedElement

export type ConvertedChildren = ConvertedChild | Array<ConvertedChild>

export type ConvertedProps = {
  children?: ConvertedChildren,
  [key: string]: mixed,
}

export type ConvertedElement = {
  type: string,
  props: ConvertedProps,
}
