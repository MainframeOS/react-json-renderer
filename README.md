# react-json-renderer

Basic converter of a React component tree to a JS object or JSON string and associated renderer using provided components.

## Installation

```sh
yarn add react-json-renderer # Yarn
npm install react-json-renderer # npm
```

React is a required peer dependency, make sure to install it as well if you haven't already:

```sh
yarn add react # Yarn
npm install react # npm
```

## APIs

### convertToObject

```js
convertToObject(
  tree: React.Element<any>,
  params?: {
    processMeta?: (tree: React.Element<any>) => ({
      name: string,
      type: 'function' | 'string' | 'unknown',
    }),
    processProps?: (props: Object) => Object,
  },
): Object
```

Converts a component tree to a formatted Object supported by the `renderFromObject()` function.

### convertToJSON

```js
convertToJSON(
  tree: React.Element<*>,
  params?: {
    processMeta?: (tree: React.Element<any>) => ({
      name: string,
      type: 'function' | 'string' | 'unknown',
    }),
    processProps?: (props: Object) => Object,
    space?: number | string,
  },
): Object
```

Converts a component tree to a JSON string supported by the `Renderer` component.

### renderFromObject

```js
renderFromObject(
  tree: Object,
  params?: {
    components?: {
      [type: string]: React.ComponentType<any>,
    },
    fallback?: React.ComponentType<any>,
  },
): React.Element<*>
```

Converts a formatted Object to a React elements tree ready to be rendered by React.

## Components

### Renderer

**Props:**

- `json?: string`: Formatted Object tree in JSON.
- `tree?: Object`: Formatted Object tree.

## Example

**Server or other source**

```js
import React from 'react'
import { convertToJSON } from 'react-json-renderer'

// Simple strings will be exported as component types and functions will be executed
const Text = 'Text'
const View = 'View'
const Welcome = ({ name }) =>
  <View>
    <Text>Welcome {name}!</Text>
  </View>

// Returns the JSON payload to provide to the client
export const createWelcome = (name) => convertToJSON(<Welcome name={name} />)
```

**Web client**

```js
import React from 'react'
import { Renderer } from 'react-json-renderer'

// Components from the payload supported by the client
const components = {
  Text: ({ children }) => <span className='text'>{children}</span>,
  View: ({ children }) => <div className='view'>{children}</div>,
}

// Fallback for unsupported components, if not provided it will return null and therefore not render the component and its children
const Fallback = ({ children }) => <div className='fallback'>{children}</div>

// Inject the JSON payload from the server and render with provided component and fallback
export const PayloadRenderer = ({ payload }) =>
  <Renderer components={components} fallback={Fallback} json={payload} />
```

**React-Native client**

```js
import React from 'react'
import { Renderer } from 'react-json-renderer'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
  view: {
    flex: 1,
  },
})

const RenderText = ({ children }) => <Text style={styles.text}>{children}</Text>
const RenderView = ({ children }) => <View style={styles.view}>{children}</View>
const components = {
  Text: RenderText,
  View: RenderView,
}

export const PayloadRenderer = ({ payload }) =>
  <Renderer components={components} fallback={RenderView} json={payload} />
```

## License

MIT  
See [LICENSE](LICENSE) file.
