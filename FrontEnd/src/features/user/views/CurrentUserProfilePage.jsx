import React, { useEffect, useState } from 'react'
import userApi from '../../auth/api/userApi'
import { uploadFile } from '../../../services/uploadFileService'
import { useNavigate } from 'react-router-dom'

const CurrentUserProfilePage = () => {
    const userId = localStorage.getItem('userId')
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        contactNumber: '',
        gender: '',
        address: '',
        birthday: '',
        publicStatus: false
    })
    const navigate = useNavigate()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userApi.getUserById(userId)
                setUser(response)
                setFormData({
                    firstName: response.firstName || '',
                    lastName: response.lastName || '',
                    bio: response.bio || '',
                    contactNumber: response.contactNumber || '',
                    gender: response.gender || '',
                    address: response.address || '',
                    birthday: response.birthday || '',
                    publicStatus: response.publicStatus || false
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, [userId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0])
        }
    }

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
            newErrors.firstName = "First name should contain only letters";
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
            newErrors.lastName = "Last name should contain only letters";
        }

        // Contact Number validation
        if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be 10 digits";
        }

        // Birthday validation
        if (formData.birthday) {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 10) {
                newErrors.birthday = "You must be at least 10 years old";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            try {
                let profileImageUrl = user?.profileImageUrl;

                if (profileImage) {
                    const imageUrl = await uploadFile(profileImage, 'profile-images');
                    profileImageUrl = imageUrl;
                }

                const updatedUserData = {
                    ...formData,
                    profileImageUrl
                };

                const response = await userApi.updateUser(userId, updatedUserData);
                setUser(response);
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await userApi.deleteUser(userId);
                localStorage.clear();
                navigate('/login');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account');
            }
        }
    };

    if (!user) return <div>Loading...</div>

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-center space-x-4 mb-6">
                    <img 
                        src={user.profileImageUrl || 'default-avatar.png'} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500"
                    />
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                            type="text"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                        {errors.contactNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Birthday</label>
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                        />
                        {errors.birthday && (
                            <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="publicStatus"
                                checked={formData.publicStatus}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    publicStatus: e.target.checked
                                }))}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Make profile public
                            </label>
                        </div>
                    </div>
                </div>

             
                <div className="flex justify-between mt-8">
                    <div className="space-x-4">
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete Account
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Logout
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                            loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update Profile'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CurrentUserProfilePage;