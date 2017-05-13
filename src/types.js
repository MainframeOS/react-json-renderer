// @flow

import type { Component, Element } from 'react'

type Props = { [key: string]: mixed }

type StatelessComponent = (props: Props) => Element<*>

export type ComponentType = string | ReactComponent

export type ReactComponent = StatelessComponent | Component<*, *, *>

export type ComponentChild = void | string | ComponentConfig

export type ComponentChildren = ComponentChild | Array<ComponentChild>

export type ComponentProps = Props & {
  children?: ComponentChildren,
}

export type ComponentConfig = {
  type: ComponentType,
  props: ComponentProps,
}

export type ConvertedChild = void | string | ConvertedComponent

export type ConvertedChildren = ConvertedChild | Array<ConvertedChild>

export type ConvertedProps = Props & {
  children?: ConvertedChildren,
}

export type ConvertedComponent = {
  type: string,
  props: ConvertedProps,
}
