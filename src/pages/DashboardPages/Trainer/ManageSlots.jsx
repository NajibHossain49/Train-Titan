import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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

  // Query for fetching slots with refetch capability
  const { data: slots = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["slots", user?.email],
    queryFn: () => fetchSlots(user.email),
    enabled: !!user?.email,
    retry: 1,
    refetchOnWindowFocus: true,
  });

  // Delete mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: deleteSlot,
    onMutate: async (deletedSlotId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["slots", user?.email]);

      // Snapshot the previous value
      const previousSlots = queryClient.getQueryData(["slots", user?.email]);

      // Optimistically update to the new value
      queryClient.setQueryData(["slots", user?.email], old => 
        old?.filter(slot => slot._id !== deletedSlotId)
      );

      return { previousSlots };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["slots", user?.email], context.previousSlots);
      toast.error(err.message || 'Failed to delete slot');
    },
    onSuccess: async () => {
      toast.success('Slot deleted successfully');
      setShowDeleteModal(false);
      // Force refetch to ensure data consistency
      await refetch();
    },
    onSettled: () => {
      // Always refetch after error or success
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
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg">Loading slots...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto my-4">
        <p className="font-bold">Error</p>
        <p>No slots are available for this User at the moment. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Manage Slots</h2>
      
      {slots.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Trainer Name</th>
                <th className="px-4 py-3 font-semibold">Class Name</th>
                <th className="px-4 py-3 font-semibold">Slot Date</th>
                <th className="px-4 py-3 font-semibold">Start Time</th>
                <th className="px-4 py-3 font-semibold">Max Participants</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Bookings</th>
                <th className="px-4 py-3 font-semibold">Membership</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {slots.map((slot) => (
                <tr key={slot._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{slot.trainerName}</td>
                  <td className="px-4 py-3">{slot.className}</td>
                  <td className="px-4 py-3">{new Date(slot.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{slot.startTime}</td>
                  <td className="px-4 py-3">{slot.maxParticipants} Participants</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      slot.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {slot.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">${slot.price}</td>
                  <td className="px-4 py-3">
                    {slot.customers && slot.customers.length > 0 ? (
                      <div className="space-y-2">
                        {slot.customers.map((customer, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-gray-500">{customer.email}</p>
                            <p className="text-gray-400">
                              Booked: {new Date(customer.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">No bookings</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{slot.membershipType}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteClick(slot)}
                      disabled={deleteMutation.isLoading}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No slots available.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete the slot
              and remove all associated booking data.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                disabled={deleteMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlots;