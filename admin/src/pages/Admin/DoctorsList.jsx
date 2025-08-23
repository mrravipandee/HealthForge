import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors, updateDoctor, deleteDoctor } = useContext(AdminContext)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    speciality: '',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    address: { line1: '', line2: '' }
  })
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState('')

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor)
    setEditFormData({
      name: doctor.name,
      email: doctor.email,
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      about: doctor.about,
      fees: doctor.fees,
      address: doctor.address || { line1: '', line2: '' }
    })
    setEditImagePreview(doctor.image)
    setEditImage(null)
    setShowEditModal(true)
  }

  const handleDeleteClick = async (doctorId, doctorName) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${doctorName}?`)) {
      try {
        await deleteDoctor(doctorId)
        toast.success('Doctor deleted successfully')
        getAllDoctors()
      } catch (error) {
        toast.error('Failed to delete doctor')
      }
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      
      // Add all form data
      Object.keys(editFormData).forEach(key => {
        if (key === 'address') {
          formData.append(key, JSON.stringify(editFormData[key]))
        } else {
          formData.append(key, editFormData[key])
        }
      })
      
      // Add image if selected
      if (editImage) {
        formData.append('image', editImage)
      }
      
      await updateDoctor(editingDoctor._id, formData)
      toast.success('Doctor updated successfully')
      setShowEditModal(false)
      setEditingDoctor(null)
      setEditImage(null)
      setEditImagePreview('')
      getAllDoctors()
    } catch (error) {
      toast.error('Failed to update doctor')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setEditFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setEditImage(null)
    setEditImagePreview('')
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden group relative' key={index}>
            <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-32 object-cover' src={item.image} alt={item.name} />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.degree}</p>
              <p className='text-[#5C5C5C] text-sm'>₹{item.fees}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
              
              {/* Action Buttons */}
              <div className='mt-3 flex gap-2'>
                <button
                  onClick={() => handleEditClick(item)}
                  className='bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(item._id, item.name)}
                  className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Doctor</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      src={editImagePreview || '/default-doctor.png'}
                      alt="Doctor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Remove Image
                      </button>
                      <p className="text-xs text-gray-500">Leave empty to keep current image</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                <input
                  type="text"
                  name="speciality"
                  value={editFormData.speciality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={editFormData.degree}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={editFormData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                <input
                  type="number"
                  name="fees"
                  value={editFormData.fees}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea
                  name="about"
                  value={editFormData.about}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  name="address.line1"
                  value={editFormData.address.line1}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="address.line2"
                  value={editFormData.address.line2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Update Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList