import React from 'react'
import "./Navbar.scss"
import {BsFillCartFill} from 'react-icons/bs'

function Navbar({onOpen}) {
  return (
    <div className='navbar'>
      <BsFillCartFill className='icon' onClick={onOpen}/>
    </div>
  )
}

export default Navbar