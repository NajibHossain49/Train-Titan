import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { TbFidgetSpinner } from 'react-icons/tb'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'

const SignUp = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photoURL: ''
  })
  const [errors, setErrors] = useState({})

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.photoURL.trim()) newErrors.photoURL = 'Photo URL is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      photoURL: ''
    })
    setErrors({})
  }

  // Check if user exists in MongoDB
  const checkUserExists = async (email) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/exist/${email}`)
      return data.exists
    } catch (err) {
      console.log(err)
      return false
    }
  }

  // Save user to MongoDB if doesn't exist
  const saveUser = async (userInfo) => {
    try {
      const userExists = await checkUserExists(userInfo.email)

      if (!userExists) {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo)
        return data.insertedId
      }
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  // form submit handler
  const handleSubmit = async event => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill all required fields correctly!')
      return
    }

    try {
      // Check if user exists in MongoDB first
      const userExists = await checkUserExists(formData.email)
      if (userExists) {
        toast.error('Email already registered! Please login instead.')
        return
      }

      // 1. Create user in Firebase
      const result = await createUser(formData.email, formData.password)

      // 2. Update user profile
      await updateUserProfile(formData.name, formData.photoURL)

      // 3. Save user to MongoDB
      const userInfo = {
        name: formData.name,
        email: formData.email,
        photoURL: formData.photoURL,
        createdAt: new Date(),
        role: 'user'
      }

      const saved = await saveUser(userInfo)

      if (saved) {
        resetForm()
        navigate('/')
        toast.success('Signup Successful!')
      }

    } catch (err) {
      console.log(err)
      resetForm()
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Email already registered! Please login instead.')
      } else {
        toast.error(err?.message || 'Something went wrong!')
      }
    }
  }

  // Handle Google Signin
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle()

      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        createdAt: new Date(),
        role: 'user'
      }

      const saved = await saveUser(userInfo)

      if (saved) {
        navigate('/')
        toast.success('Google Sign-in Successful!')
      }

    } catch (err) {
      console.log(err)
      toast.error(err?.message || 'Something went wrong!')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='w-full max-w-md p-8 rounded-2xl shadow-xl bg-white'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Sign Up
          </h1>
          <p className='mt-2 text-sm text-gray-500'>
            Join TrainTitan today and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label htmlFor='name' className='text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder='Enter your name'
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-500'>{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor='email' className='text-sm font-medium text-gray-700'>
              Email address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder='Enter your email'
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor='photoURL' className='text-sm font-medium text-gray-700'>
              Photo URL
            </label>
            <input
              type='url'
              name='photoURL'
              id='photoURL'
              value={formData.photoURL}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-3 rounded-lg border ${errors.photoURL ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder='Enter photo URL'
            />
            {errors.photoURL && (
              <p className='mt-1 text-sm text-red-500'>{errors.photoURL}</p>
            )}
          </div>

          <div>
            <label htmlFor='password' className='text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              value={formData.password}
              onChange={handleInputChange}
              className={`mt-1 w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              placeholder='Create a password'
              autoComplete='new-password'
            />
            {errors.password && (
              <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
          >
            {loading ? (
              <TbFidgetSpinner className='animate-spin m-auto text-2xl' />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className='w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          <FcGoogle size={24} />
          <span className='text-gray-700 font-medium'>Continue with Google</span>
        </button>

        <p className='mt-6 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp