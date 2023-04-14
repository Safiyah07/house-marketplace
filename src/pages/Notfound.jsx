import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as HomeIcon } from '../assets/svg/homeIcon.svg'

function Notfound() {
	return (
		<>
			<div className='not-found'>
				<h5>Sorry, The page you are looking for does not exist👻</h5>
				<h1>404</h1>
				<h3>Page Not Found</h3>
				<button>
					<HomeIcon style={{ marginRight: '10px' }} />
					<Link to='/'>Back to home</Link>
				</button>
			</div>
		</>
	)
}

export default Notfound
