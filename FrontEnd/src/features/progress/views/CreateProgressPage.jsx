import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressUpdateApi from '../api/progressApi';
import planApi from '../../plans/api/planApi';

const CreateProgressPage = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true,
    hoursSpent: '',
    type: '',
    rating: '',
    sentiment: '',
    challenges: [''],
    achievements: [''],
    relatedPlanId: '',
    learningUnitId: '',
    userId: currentUserId
  });

  // UI state
  const [plans, setPlans] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Progress types and sentiments
  const progressTypes = [
    'MILESTONE',
    'DAILY_UPDATE',
    'CHALLENGE',
    'REFLECTION',
    'STUCK',
    'COMPLETED'
  ];

  const sentiments = [
    'EXCITED',
    'SATISFIED',
    'NEUTRAL',
    'FRUSTRATED',
    'OVERWHELMED'
  ];

  // Validation patterns
  const validationPatterns = {
    title: /^.{5,100}$/,
    content: /^.{10,1000}$/,
    hoursSpent: /^[1-9][0-9]*$/,
    challenge: /^.{3,200}$/,
    achievement: /^.{3,200}$/
  };

  // Validation messages
  const validationMessages = {
    title: "Title must be between 5 and 100 characters",
    content: "Content must be between 10 and 1000 characters",
    hoursSpent: "Hours spent must be a positive number",
    type: "Please select a progress type",
    challenge: "Challenge must be between 3 and 200 characters",
    achievement: "Achievement must be between 3 and 200 characters",
    relatedPlanId: "Please select a learning plan"
  };

  // Fetch plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await planApi.getPublicLearningPlans();
        setPlans(response.content);
      } catch (error) {
        toast.error("Failed to load learning plans");
      } finally {
        setIsLoadingPlans(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Fetch units when a plan is selected
  useEffect(() => {
    if (formData.relatedPlanId) {
      const selectedPlan = plans.find(plan => plan.id === formData.relatedPlanId);
      if (selectedPlan) {
        setUnits(selectedPlan.learningUnits);
      }
    } else {
      setUnits([]);
    }
  }, [formData.relatedPlanId, plans]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle challenge/achievement changes
  const handleListChange = (listName, index, value) => {
    const updatedList = [...formData[listName]];
    updatedList[index] = value;
    setFormData({
      ...formData,
      [listName]: updatedList
    });
    
    // Clear error for this item if it exists
    if (errors[`${listName}_${index}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`${listName}_${index}`];
      setErrors(updatedErrors);
    }
  };

  // Add new challenge/achievement
  const addListItem = (listName) => {
    setFormData({
      ...formData,
      [listName]: [...formData[listName], '']
    });
  };

  // Remove challenge/achievement
  const removeListItem = (listName, index) => {
    if (formData[listName].length <= 1) {
      toast.error(`You must have at least one ${listName.slice(0, -1)}`);
      return;
    }
    
    const updatedList = formData[listName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [listName]: updatedList
    });
    
    // Remove any errors associated with this item
    const updatedErrors = { ...errors };
    delete updatedErrors[`${listName}_${index}`];
    setErrors(updatedErrors);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!validationPatterns.title.test(formData.title)) {
      newErrors.title = validationMessages.title;
    }
    
    if (!validationPatterns.content.test(formData.content)) {
      newErrors.content = validationMessages.content;
    }
    
    if (!formData.type) {
      newErrors.type = validationMessages.type;
    }
    
    if (!validationPatterns.hoursSpent.test(formData.hoursSpent)) {
      newErrors.hoursSpent = validationMessages.hoursSpent;
    }
    
    if (formData.relatedPlanId && !formData.learningUnitId) {
      newErrors.learningUnitId = "Please select a learning unit";
    }
    
    // Validate challenges
    formData.challenges.forEach((challenge, index) => {
      if (challenge && !validationPatterns.challenge.test(challenge)) {
        newErrors[`challenges_${index}`] = validationMessages.challenge;
      }
    });
    
    // Validate achievements
    formData.achievements.forEach((achievement, index) => {
      if (achievement && !validationPatterns.achievement.test(achievement)) {
        newErrors[`achievements_${index}`] = validationMessages.achievement;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Filter out empty challenges and achievements
      const submissionData = {
        ...formData,
        challenges: formData.challenges.filter(c => c.trim()),
        achievements: formData.achievements.filter(a => a.trim()),
        hoursSpent: parseInt(formData.hoursSpent),
        rating: formData.rating ? parseInt(formData.rating) : null
      };
      
      await ProgressUpdateApi.createProgressUpdate(submissionData);
      toast.success("Progress update created successfully!");
      navigate('/progress'); // Redirect to progress updates page
    } catch (error) {
      toast.error(error.message || "Failed to create progress update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Create Progress Update</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="What did you work on?"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe your progress in detail..."
            ></textarea>
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours Spent <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="hoursSpent"
                value={formData.hoursSpent}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md ${errors.hoursSpent ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., 3"
              />
              {errors.hoursSpent && <p className="text-red-500 text-xs mt-1">{errors.hoursSpent}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a type</option>
                {progressTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ').toLowerCase()}</option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a rating</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sentiment
              </label>
              <select
                name="sentiment"
                value={formData.sentiment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select your feeling</option>
                {sentiments.map(sentiment => (
                  <option key={sentiment} value={sentiment}>{sentiment.toLowerCase()}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Make this progress update public
            </label>
          </div>
        </div>
        
        {/* Learning Plan Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Learning Plan</h2>
          
          {isLoadingPlans ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Learning Plan
                </label>
                <select
                  name="relatedPlanId"
                  value={formData.relatedPlanId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.relatedPlanId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a plan (optional)</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.title}</option>
                  ))}
                </select>
                {errors.relatedPlanId && <p className="text-red-500 text-xs mt-1">{errors.relatedPlanId}</p>}
              </div>
              
              {formData.relatedPlanId && units.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Learning Unit (optional)
                  </label>
                  <select
                    name="learningUnitId"
                    value={formData.learningUnitId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.learningUnitId ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select a unit</option>
                    {units.map(unit => (
                      <option key={unit.unitId} value={unit.unitId}>{unit.title}</option>
                    ))}
                  </select>
                  {errors.learningUnitId && <p className="text-red-500 text-xs mt-1">{errors.learningUnitId}</p>}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Challenges */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Challenges Faced</h2>
          
          {formData.challenges.map((challenge, index) => (
            <div key={`challenge-${index}`} className="flex items-center space-x-2">
              <input
                type="text"
                value={challenge}
                onChange={(e) => handleListChange('challenges', index, e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md ${errors[`challenges_${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="What challenges did you face?"
              />
              <button
                type="button"
                onClick={() => removeListItem('challenges', index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
              {errors[`challenges_${index}`] && (
                <p className="text-red-500 text-xs">{errors[`challenges_${index}`]}</p>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addListItem('challenges')}
            className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Challenge
          </button>
        </div>
        
        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Achievements</h2>
          
          {formData.achievements.map((achievement, index) => (
            <div key={`achievement-${index}`} className="flex items-center space-x-2">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleListChange('achievements', index, e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md ${errors[`achievements_${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="What did you accomplish?"
              />
              <button
                type="button"
                onClick={() => removeListItem('achievements', index)}
                className="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
              {errors[`achievements_${index}`] && (
                <p className="text-red-500 text-xs">{errors[`achievements_${index}`]}</p>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addListItem('achievements')}
            className="inline-flex items-center px-3 py-1 border border-green-300 text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Achievement
          </button>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : "Create Progress Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProgressPage;