// @flow

import type { Component, Element, Node } from 'react'

export type ElementChild =
  | void
  | null
  | boolean
  | number
  | string
  | Element<any>

export type ElementChildren = ElementChild | Array<ElementChild>

export type ElementProps = {
  children?: Node,
  [key: string]: mixed,
}

export type ConvertedChild =
  | void
  | null
  | boolean
  | number
  | string
  | ConvertedElement

export type ConvertedChildren = ConvertedChild | Array<ConvertedChild>

export type ConvertedProps = {
  children?: ConvertedChildren,
  [key: string]: mixed,
}

export type ConvertedElement = {
  type: string,
  props: ConvertedProps,
}
