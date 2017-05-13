# react-json-renderer

Basic converter of a React component tree to a JS object or JSON string and associated renderer using provided components.

## Installation

```sh
yarn add react-json-renderer # Yarn
npm install react-json-renderer # npm
```

React is a required peer dependencies, make sure to install it as well if you haven't already:

```sh
yarn add react # Yarn
npm install react # npm
```

## Example

**Server or other source**

```js
import React from 'react'
import { convertToJSON } from 'react-json-renderer'

// React components or simple strings can be converted
const Text = 'Text'
const View = ({ children }) => children
const Welcome = ({ name }) => (
  <View>
    <Text>Welcome {name}!</Text>
  </View>
)

// Returns the JSON payload to provide to the client
export const createWelcome = (name) => {
  return convertToJSON(<Welcome name={name} />)
}
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
export const PayloadRenderer = ({ payload }) => (
  <Renderer components={components} fallback={Fallback} json={payload} />
)
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

export const PayloadRenderer = ({ payload }) => (
  <Renderer components={components} fallback={RenderView} json={payload} />
)
```

## License

MIT  
See [LICENSE](LICENSE) file.
