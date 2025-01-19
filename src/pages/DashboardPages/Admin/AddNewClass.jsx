import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbFidgetSpinner } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddNewClassForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  
  const formRef = React.useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

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

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
      setImageUrl('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    const result = await Swal.fire({
      title: 'Add New Class',
      text: 'Are you sure you want to add this class?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;
    
    setLoading(true)

    try {
      const form = event.target
      const className = form.className.value
      const details = form.details.value
      const additionalInfo = form.additionalInfo.value
      const imageFile = form.image.files[0]

      const imageUrl = await uploadImage(imageFile)
      if (!imageUrl) {
        setLoading(false)
        return
      }

      const classInfo = {
        className,
        details,
        additionalInfo,
        image: imageUrl,
        createdAt: new Date()
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/classes`,
        classInfo
      )

      if (data.insertedId) {
        resetForm();
        await Swal.fire({
          title: 'Success!',
          text: 'Class has been added successfully',
          icon: 'success',
          confirmButtonColor: '#4F46E5'
        });
        navigate('/'); 
      }

    } catch (err) {
      console.log(err)
      toast.error(err?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <TbFidgetSpinner className="w-16 h-16 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300 hover:shadow-2xl'>
          <div className='mb-10 text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-3'>Add New Class</h1>
            <p className='text-gray-500'>Enhance TrainTitan with a new class offering</p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='space-y-8'
          >
            <div className='space-y-6'>
              {/* Class Name */}
              <div>
                <label htmlFor='className' className='text-sm font-medium text-gray-700 block mb-2'>
                  Class Name
                </label>
                <input
                  type='text'
                  name='className'
                  id='className'
                  required
                  placeholder='Enter Class Name'
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white'
                />
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor='image' className='text-sm font-medium text-gray-700 block mb-2'>
                  Class Image
                </label>
                <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors duration-200'>
                  <div className='space-y-1 text-center'>
                    <div className='flex text-sm text-gray-600'>
                      <input
                        type='file'
                        name='image'
                        id='image'
                        accept='image/*'
                        required
                        className='w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <label htmlFor='details' className='text-sm font-medium text-gray-700 block mb-2'>
                  Class Details
                </label>
                <textarea
                  name='details'
                  id='details'
                  required
                  placeholder='Enter class details'
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 min-h-[120px] bg-white'
                />
              </div>

              {/* Additional Info */}
              <div>
                <label htmlFor='additionalInfo' className='text-sm font-medium text-gray-700 block mb-2'>
                  Additional Information
                </label>
                <textarea
                  name='additionalInfo'
                  id='additionalInfo'
                  required
                  placeholder='Enter additional information (optional)'
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 min-h-[100px] bg-white'
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center'
              disabled={loading}
            >
              {loading ? (
                <TbFidgetSpinner className='animate-spin h-6 w-6' />
              ) : (
                'Add Class'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewClassForm;