import { Component, h } from 'preact'
import render from '..'

const element = {
  $$typeof: Symbol.for('react.test.json'),
  children: null,
  key: null,
  props: {},
}

describe('preact-to-json', () => {
  it('works with one component', () => {
    const Foo = () => (<div />)
    const actual = render(<Foo />)

    expect(actual).toEqual({ ...element, type: 'div' })
  })

  it('only shallow renders', () => {
    const Child = () => (<div />)
    const Parent = () => (<Child />)
    const Grandparent = () => (<Parent />)
    const actual = render(<Grandparent />)

    expect(actual).toEqual({
      ...element,
      type: 'Parent',
    })
    expect(actual).toMatchSnapshot()
  })

  it('works with attributes', () => {
    const Link = ({ to, text }: any) => (<a href={to}>{text}</a>)
    const actual = render(<Link to="//google.com" text="Google" />)

    expect(actual).toEqual({
      ...element,
      children: [ 'Google' ],
      props: { href: '//google.com' },
      type: 'a',
    })
    expect(actual).toMatchSnapshot()
  })

  it('prints objects nicely', () => {
    const Child = ( props: any ) => (<div />)
    const Parent = ( props: any ) => (<Child {...props} />)
    const actual = render(<Parent style={{ color: 'rebeccapurple', outline: 0 }} />)

    expect(actual).toEqual({
      ...element,
      props: { style: { color: 'rebeccapurple', outline: 0 } },
      type: 'Child',
    })
    expect(actual).toMatchSnapshot()
  })

  it('supports displaying functions', () => {
    const Child = ( props: any ) => (<div />)
    const Parent = ( props: any ) => (<Child {...props} />)
    const actual = render(<Parent handleClick={jest.fn()} />)

    expect(actual).toEqual({
      ...element,
      props: { handleClick: expect.any(Function) },
      type: 'Child',
    })
    expect(actual).toMatchSnapshot()
  })

  it('makes pretty snapshots', () => {
    const Header = ({ text }: any) => (<header>{text}</header>)
    const Item = ({ text }: any) => (<li>{text}</li>)
    const List = ({ items }: any) => (<ul>{items.map(( item: any ) => <Item text={item} />)}</ul>)
    const Container = () => (<div><Header text="List" /><List items={[ 1, 2, 3, 4, 5 ]} /></div>)
    const actual = render(<Container />)

    expect(actual).toEqual({
      ...element,
      children: [
        { ...element, type: 'Header', props: { text: 'List' } },
        { ...element, type: 'List', props: { items: [ 1, 2, 3, 4, 5 ] } },
      ],
      type: 'div',
    })
    expect(actual).toMatchSnapshot()
  })

  it('works with class components', () => {
    class Foo extends Component<{}, {}> {
      public render() {
        return <div />
      }
    }
    const actual = render(<Foo />)

    expect(actual).toEqual({ ...element, type: 'div' })
    expect(actual).toMatchSnapshot()
  })
})
