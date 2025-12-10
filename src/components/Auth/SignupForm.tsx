import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    softwareExperience: 'beginner',
    roboticsExperience: 'none',
    hasRTX: false,
    hasJetson: false,
    hasRealRobot: false,
    preferredLanguages: ['English'],
  });

  const { signUp, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create user profile data
      const profileData = {
        email: formData.email,
        password: formData.password,
        // Store extended profile data in user attributes
        $: {
          softwareExperience: formData.softwareExperience,
          roboticsExperience: formData.roboticsExperience,
          hasRTX: formData.hasRTX,
          hasJetson: formData.hasJetson,
          hasRealRobot: formData.hasRealRobot,
          preferredLanguages: JSON.stringify(formData.preferredLanguages),
        }
      };

      await signUp('email', profileData);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          className="form-input"
        />
      </div>

      {/* Background questions */}
      <div className="form-group">
        <label htmlFor="softwareExperience">Software Experience</label>
        <select
          id="softwareExperience"
          value={formData.softwareExperience}
          onChange={(e) => setFormData({...formData, softwareExperience: e.target.value})}
          className="form-select"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="roboticsExperience">Robotics/ROS Experience</label>
        <select
          id="roboticsExperience"
          value={formData.roboticsExperience}
          onChange={(e) => setFormData({...formData, roboticsExperience: e.target.value})}
          className="form-select"
        >
          <option value="none">None</option>
          <option value="some">Some</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.hasRTX}
            onChange={(e) => setFormData({...formData, hasRTX: e.target.checked})}
          />
          Access to RTX-class GPU?
        </label>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.hasJetson}
            onChange={(e) => setFormData({...formData, hasJetson: e.target.checked})}
          />
          Access to Jetson (Orin Nano/NX)?
        </label>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.hasRealRobot}
            onChange={(e) => setFormData({...formData, hasRealRobot: e.target.checked})}
          />
          Access to real robot?
        </label>
      </div>

      <div className="form-group">
        <label>Preferred Languages</label>
        <div className="language-options">
          <label>
            <input
              type="checkbox"
              checked={formData.preferredLanguages.includes('English')}
              onChange={(e) => {
                if (e.target.checked) {
                  setFormData({
                    ...formData,
                    preferredLanguages: [...formData.preferredLanguages, 'English']
                  });
                } else {
                  setFormData({
                    ...formData,
                    preferredLanguages: formData.preferredLanguages.filter(lang => lang !== 'English')
                  });
                }
              }}
            />
            English
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.preferredLanguages.includes('Urdu')}
              onChange={(e) => {
                if (e.target.checked) {
                  setFormData({
                    ...formData,
                    preferredLanguages: [...formData.preferredLanguages, 'Urdu']
                  });
                } else {
                  setFormData({
                    ...formData,
                    preferredLanguages: formData.preferredLanguages.filter(lang => lang !== 'Urdu')
                  });
                }
              }}
            />
            Urdu
          </label>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;