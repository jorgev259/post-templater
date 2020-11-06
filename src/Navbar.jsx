import { useState } from 'react'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { shell } from 'electron'

export default function Bar (props) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div>
      <Navbar dark color='dark' expand='sm'>
        <NavbarBrand><img alt='' style={{ height: '40px', width: 'auto' }} src='logo.png' /></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='mr-auto' navbar>
            {Object.keys(props.routes).map(name => (
              <NavItem className={classnames({ active: name === props.page })} key={name}>
                <NavLink href='#' onClick={() => props.setPage(name)}>{name}</NavLink>
              </NavItem>
            ))}

            <NavItem className='ml-md-1'>
              <button
                style={{ border: 0, padding: 0, background: 'transparent' }}
                onClick={ev => {
                  ev.preventDefault()
                  shell.openExternal('https://ko-fi.com/E1E8I3VN')
                }}
              >
                <img style={{ border: '0px', height: '40px' }} src='https://cdn.ko-fi.com/cdn/kofi2.png?v=2' alt='Buy Me a Coffee at ko-fi.com' />
              </button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}
