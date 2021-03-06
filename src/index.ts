import { ComponentConstructor } from 'preact'

export type Child = string | number | JSX.Element | Element
export type NodeName = string | ComponentConstructor<any, any>
export type Element = {
  $$typeof: symbol,
  children: Child[] | null,
  key: string | null,
  props: {
    [ key: string ]: any,
  },
  type: NodeName,
}
type Attributes = { [ name: string ]: any }

/**
 * Determines the name of the component.
 *
 * If the node is a component, it will look for `displayName` property,
 * then fallback on the function name or `Component`. If it is a DOM element,
 * then that tag is returned.
 *
 * @param {string | ComponentConstructor<any, any>} nodeName The node to get
 * the name for.
 *
 * @return {string}
 */
const getType = ( nodeName: NodeName ): string => {
  return typeof nodeName === 'function'
    ? (nodeName as any).displayName || nodeName.name || 'Component'
    : nodeName
}

/**
 * Converts the `children` property to JSON.
 *
 * Will take a child component and either return it if it is a string | number,
 * or will convert it to JSON if another component.
 *
 * @param {string | number | VNode | Element} child The child component to
 * operate on.
 *
 * @return {string | number | Element}
 */
const mapChildrenToJSON = ( child: Child ): Child => {
  if ( typeof child === 'string' || typeof child === 'number' ) {
    return child
  }

  return toJSON(child as JSX.Element)
}

/**
 * Filters out `children` key from the attribute object.
 *
 * @param {Attributes} attributes The attribute object.
 *
 * @return {Attributes}
 */
const getWithoutChildren = ( attributes: Attributes ): Attributes =>
  Object.keys(attributes).reduce(
    ( acc, key ) => key === 'children'
      ? acc
      : { ...acc, [key]: attributes[key] },
    {},
  )

/**
 * Filter out possible null or undefined children.
 *
 * @param {preact.VNode[]} children The children to filter on.
 *
 * @return {preact.VNode[]}
 */
const getValidChildren = ( children: preact.VNode[] ) =>
  children.filter(child => child != null)

/**
 * Turns a VNode (Preact Component) into JSON.
 *
 * Will take a component and convert it to a JSON representation. This will make
 * it compatible with snapshot testing.
 *
 * @param {JSX.Element} vnode The VNode to convert to JSON.
 *
 * @return {Element}
 */
const toJSON = ({ attributes = null, children, key = null, nodeName }: JSX.Element): Element => ({
  $$typeof: Symbol.for('react.test.json'),
  children: Array.isArray(children)
    ? getValidChildren(children).length === 0
      ? null
      : getValidChildren(children).map(mapChildrenToJSON)
    : children,
  key,
  props: getWithoutChildren(attributes || {}),
  type: getType(nodeName),
})

/**
 * Renders a Preact component.
 *
 * @param {any} nodeName The component to render.
 * @param {Object} props The props object.
 *
 * @return {Element}
 */
const renderComponent = ( nodeName: any, props: Element['props'] ): JSX.Element => {
  // stateless functional component
  if ( !nodeName.prototype || typeof nodeName.prototype.render !== 'function' ) {
    return (nodeName as Function)(props)
  }

  const component = new nodeName(props)

  return component.render(component.props, component.state)
}

/**
 * Renders a Preact component and passes it to `toJSON`.
 *
 *
 * @return {Element | void}
 */
const render = ({ attributes, children, nodeName }: JSX.Element): Element | void => {
  const rendered = renderComponent(nodeName, { ...attributes, children })

  if ( rendered ) {
    return toJSON(rendered)
  }
}

export { render }
export default render
