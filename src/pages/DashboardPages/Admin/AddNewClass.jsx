import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbFidgetSpinner } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AddNewClassForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Upload image to ImgBB
  const uploadImage = async (image) => {
    try {
      const formData = new FormData()
      formData.append('image', image)
      
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      )
      
      return response.data.data.display_url
    } catch (err) {
      toast.error('Image upload failed!')
      return null
    }
  }

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const form = event.target
      const className = form.className.value
      const details = form.details.value
      const additionalInfo = form.additionalInfo.value
      const imageFile = form.image.files[0]

      // 1. Upload image to ImgBB
      const imageUrl = await uploadImage(imageFile)
      if (!imageUrl) {
        setLoading(false)
        return
      }

      // 2. Create class info object
      const classInfo = {
        className,
        details,
        additionalInfo,
        image: imageUrl,
        createdAt: new Date()
      }

      // 3. Save class to MongoDB
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/classes`,
        classInfo
      )

      if (data.insertedId) {
        toast.success('Class added successfully!')
        navigate('/classes') // Adjust the route as needed
        form.reset()
      }

    } catch (err) {
      console.log(err)
      toast.error(err?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-white'>
      <div className='flex flex-col max-w-2xl p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900 w-full'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Add New Class</h1>
          <p className='text-sm text-gray-400'>Add a new class to TrainTitan</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-6 ng-untouched ng-pristine ng-valid'
        >
          <div className='space-y-4'>
            {/* Class Name */}
            <div>
              <label htmlFor='className' className='block mb-2 text-sm'>
                Class Name
              </label>
              <input
                type='text'
                name='className'
                id='className'
                required
                placeholder='Enter Class Name'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor='image' className='block mb-2 text-sm'>
                Class Image
              </label>
              <input
                type='file'
                name='image'
                id='image'
                accept='image/*'
                required
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
              />
            </div>

            {/* Details */}
            <div>
              <label htmlFor='details' className='block mb-2 text-sm'>
                Class Details
              </label>
              <textarea
                name='details'
                id='details'
                required
                placeholder='Enter class details'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900 min-h-[100px]'
              />
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor='additionalInfo' className='block mb-2 text-sm'>
                Additional Information
              </label>
              <textarea
                name='additionalInfo'
                id='additionalInfo'
                placeholder='Enter additional information (optional)'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900'
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='bg-lime-500 w-full rounded-md py-3 text-white'
            disabled={loading}
          >
            {loading ? (
              <TbFidgetSpinner className='animate-spin m-auto' />
            ) : (
              'Add Class'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddNewClassForm;