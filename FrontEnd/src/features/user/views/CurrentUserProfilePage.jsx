import React, { useEffect, useState } from 'react';
import userApi from '../../auth/api/userApi';
import { uploadFile } from '../../../services/uploadFileService';
import { useNavigate } from 'react-router-dom';

const CurrentUserProfilePage = () => {
    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        contactNumber: '',
        gender: '',
        address: '',
        birthday: '',
        publicStatus: false
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userApi.getUserById(userId);
                setUser(response);
                setFormData({
                    firstName: response.firstName || '',
                    lastName: response.lastName || '',
                    bio: response.bio || '',
                    contactNumber: response.contactNumber || '',
                    gender: response.gender || '',
                    address: response.address || '',
                    birthday: response.birthday || '',
                    publicStatus: response.publicStatus || false
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
            newErrors.firstName = "First name should contain only letters";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
            newErrors.lastName = "Last name should contain only letters";
        }

        if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be 10 digits";
        }

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
                setShowUpdateModal(true);
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

    const confirmDeleteAccount = async () => {
        try {
            await userApi.deleteUser(userId);
            localStorage.clear();
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account');
        }
    };

    if (!user) return <div className="h-screen flex justify-center items-center text-lg text-gray-700">Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-5xl bg-blue-100 shadow-xl rounded-2xl p-10">
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-8">My Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                        <img 
                            src={user.profileImageUrl || '/default-avatar.png'} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full border-4 border-emerald-500 object-cover"
                        />
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: 'First Name', name: 'firstName' },
                            { label: 'Last Name', name: 'lastName' }
                        ].map(({ label, name }) => (
                            <div key={name}>
                                <label className="block text-sm font-semibold text-gray-700">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
                            </div>
                        ))}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.contactNumber && <p className="text-sm text-red-600 mt-1">{errors.contactNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Birthday</label>
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {errors.birthday && <p className="text-sm text-red-600 mt-1">{errors.birthday}</p>}
                        </div>

                        <div className="md:col-span-2 flex items-center mt-2">
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
                            <label className="ml-2 text-sm text-gray-800">Make profile public</label>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm"
                            >
                                Delete Account
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md text-sm"
                            >
                                Logout
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Success</h3>
                        <p className="text-sm text-gray-700">Profile updated successfully!</p>
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                        <p className="text-sm text-gray-700 mb-4">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentUserProfilePage;
