import React, { useState } from 'react';

interface SignupFormProps {}

const SignupForm: React.FC<SignupFormProps> = () => {
  // Step 1: Email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Background questionnaire
  const [softwareExp, setSoftwareExp] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [hardwareRTX, setHardwareRTX] = useState(false);
  const [hardwareRobot, setHardwareRobot] = useState(false);
  const [preferredLang, setPreferredLang] = useState<'en' | 'ur'>('en');

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setCurrentStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the sign-up API endpoint directly
      const response = await fetch('http://localhost:4000/api/auth/sign-up/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          // Include the extended profile data in the signup request
          profile: {
            software_exp: softwareExp,
            hardware_rtx: hardwareRTX,
            hardware_robot: hardwareRobot,
            preferred_lang: preferredLang
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Sign up failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Successful sign-up - redirect or update context
      const result = await response.json();

      // Optionally reload the page or update context to reflect the new session
      window.location.reload();
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {currentStep === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Background Questionnaire</h3>
              <p className="text-sm text-gray-500">Help us personalize your learning experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Software Experience Level
              </label>
              <div className="space-y-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="softwareExp"
                      checked={softwareExp === level}
                      onChange={() => setSoftwareExp(level)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hardware Access
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hardwareRTX}
                    onChange={(e) => setHardwareRTX(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I have access to RTX-capable GPU hardware
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hardwareRobot}
                    onChange={(e) => setHardwareRobot(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I have access to physical robot hardware
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredLang"
                    checked={preferredLang === 'en'}
                    onChange={() => setPreferredLang('en')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    English
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredLang"
                    checked={preferredLang === 'ur'}
                    onChange={() => setPreferredLang('ur')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    اردو (Urdu)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignupForm;