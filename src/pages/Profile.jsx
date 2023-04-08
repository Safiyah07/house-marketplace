import { useState, useEffect } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import {
	updateDoc,
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
	startAfter,
	limit,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from './../components/ListingItem'

function Profile() {
	const auth = getAuth()
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState(null)
	const [lastFetchedListing, setLastFetchedListing] = useState(null)
	const [changeDetails, setChangeDetails] = useState(false)
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	})

	const { name, email } = formData

	const navigate = useNavigate()

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, 'listings')

			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc'),
				limit(5)
			)

			const querySnap = await getDocs(q)

			const lastVisible = querySnap.docs[querySnap.docs.length - 1]
			setLastFetchedListing(lastVisible)

			let listings = []

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})

			setListings(listings)
			setLoading(false)
		}

		fetchUserListings()
	}, [auth.currentUser.uid])

	const onLogout = () => {
		auth.signOut()
		navigate('/')
	}

	const onSubmit = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				// Update display name
				await updateProfile(auth.currentUser, {
					displayName: name,
				})

				// Update in Firestore
				const userRef = doc(db, 'users', auth.currentUser.uid)
				await updateDoc(userRef, {
					name,
				})
			}
		} catch (error) {
			toast.error('Could Not Update Profile Details')
		}
	}

	// Pagination / Load More
	const onFetchMoreListings = async () => {
		try {
			// Get a reference
			const listingsRef = collection(db, 'listings')

			// Create a query
			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc'),
				startAfter(lastFetchedListing),
				limit(5)
			)

			// Execute query
			const querySnap = await getDocs(q)

			const lastVisible = querySnap.docs[querySnap.docs.length - 1]
			setLastFetchedListing(lastVisible)

			const listings = []

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})

			setListings((prevState) => [...prevState, ...listings])
			setLoading(false)
		} catch (error) {
			toast.error('Could Not Fetch Listings')
		}
	}

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}))
	}

	const onDelete = async (listingId) => {
		if (window.confirm('Are you sure you want to delete?')) {
			await deleteDoc(doc(db, 'listings', listingId))

			const updatedListings = listings.filter(
				(listing) => listing.id !== listing
			)
			setListings(updatedListings)
			toast.success('Successfully deleted listing')
		}
	}

	const onEdit = (listingId) => {
		navigate(`/edit-listing/${listingId}`)
	}

	return (
		<div className='profile'>
			<header className='profileHeader'>
				<p className='pageHeader'>My Profile</p>
				<button
					type='button'
					className='logOut'
					onClick={onLogout}
				>
					Log Out
				</button>
			</header>

			<main>
				<div className='profileDetailsHeader'>
					<p className='profileDetailsText'>Personal Details</p>
					<p
						className='changePersonalDetails'
						onClick={() => {
							changeDetails && onSubmit()
							setChangeDetails((prevState) => !prevState)
						}}
					>
						{changeDetails ? 'Done' : 'Change'}
					</p>
				</div>

				<div className='profileCard'>
					<form>
						<input
							type='text'
							id='name'
							className={!changeDetails ? 'profileName' : 'profileNameActive'}
							disabled={!changeDetails}
							value={name}
							onChange={onChange}
						/>

						<input
							type='text'
							id='email'
							className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
							disabled={!changeDetails}
							value={email}
							onChange={onChange}
						/>
					</form>
				</div>

				<Link
					to='/create-listing'
					className='createListing'
				>
					<img
						src={homeIcon}
						alt='home'
					/>
					<p>Sell Or Rent Your Home</p>
					<img
						src={arrowRight}
						alt='arrow-right'
					/>
				</Link>

				{!loading && listings?.length > 0 && (
					<>
						<p className='listingText'>Your Listings</p>
						{listings.map((listing) => (
							<ListingItem
								key={listing.id}
								listing={listing.data}
								id={listing.id}
								onDelete={() => onDelete(listing.id)}
								onEdit={() => onEdit(listing.id)}
							/>
						))}
					</>
				)}
			</main>

			<br />
			{lastFetchedListing && (
				<p
					style={{ backgroundColor: '#8c6140' }}
					className='loadMore'
					onClick={onFetchMoreListings}
				>
					Load More
				</p>
			)}
		</div>
	)
}

export default Profile
