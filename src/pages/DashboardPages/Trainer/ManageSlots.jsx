import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';

const fetchSlots = async (email) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/slots/byEmail/${email}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      }
    });
    return response.data.slots;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch slots");
  }
};

const deleteSlot = async (slotId) => {
  try {
    const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/slots/${slotId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access-token')}`
      }
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete slot');
  }
};

const ManageSlots = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { data: slots = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["slots", user?.email],
    queryFn: () => fetchSlots(user.email),
    enabled: !!user?.email,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlot,
    onMutate: async (deletedSlotId) => {
      await queryClient.cancelQueries(["slots", user?.email]);
      const previousSlots = queryClient.getQueryData(["slots", user?.email]);
      queryClient.setQueryData(["slots", user?.email], old => 
        old?.filter(slot => slot._id !== deletedSlotId)
      );
      return { previousSlots };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["slots", user?.email], context.previousSlots);
      toast.error(err.message || 'Failed to delete slot');
    },
    onSuccess: async () => {
      toast.success('Slot deleted successfully');
      setShowDeleteModal(false);
      await refetch();
    },
    onSettled: () => {
      queryClient.invalidateQueries(["slots", user?.email]);
    }
  });

  const handleDeleteClick = (slot) => {
    setSelectedSlot(slot);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedSlot) {
      try {
        await deleteMutation.mutateAsync(selectedSlot._id);
      } catch (error) {
        console.error('Error deleting slot:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="p-8 rounded-lg bg-white shadow-lg">
          <TbFidgetSpinner className="w-16 h-16 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600 font-medium">Loading slots...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-2xl w-full">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-bold">Error</p>
          </div>
          <p className="mt-2">No slots are available for this User at the moment. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Manage Slots</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your training slots and view bookings</p>
          </div>
          
          {slots.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {slots.map((slot) => (
                    <tr key={slot._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{slot.trainerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{slot.className}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(slot.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{slot.startTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{slot.maxParticipants} Participants</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${slot.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}>
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${slot.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        {slot.customers && slot.customers.length > 0 ? (
                          <div className="space-y-3">
                            {slot.customers.map((customer, idx) => (
                              <div key={idx} className="bg-gray-50 p-2 rounded-md">
                                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                <p className="text-xs text-gray-500">{customer.email}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Booked: {new Date(customer.paymentDate).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No bookings</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{slot.membershipType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteClick(slot)}
                          disabled={deleteMutation.isLoading}
                          className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-900">No slots available</p>
              <p className="mt-2 text-sm text-gray-500">Get started by creating a new slot.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Delete Slot</h3>
              <p className="mt-3 text-sm text-gray-500 text-center">
                This action cannot be undone. This will permanently delete the slot
                and remove all associated booking data.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={deleteMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isLoading}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleteMutation.isLoading ? (
                    <>
                      <TbFidgetSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlots;