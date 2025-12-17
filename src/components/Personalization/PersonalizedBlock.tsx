import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

interface Requirement {
  field: 'software_exp' | 'hardware_rtx' | 'hardware_robot';
  value: string;
}

interface PersonalizedBlockProps {
  requirements: Requirement[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PersonalizedBlock: React.FC<PersonalizedBlockProps> = ({
  requirements,
  children,
  fallback = null
}) => {
  const { user } = useContext(UserContext);

  // Check if user meets all requirements
  const meetsRequirements = requirements.every(req => {
    if (!user) return false; // If no user, don't show personalized content

    const userValue = user[req.field];
    if (typeof userValue === 'boolean') {
      // For boolean fields like hardware_rtx, hardware_robot
      return req.value === 'true' ? userValue : !userValue;
    } else {
      // For string fields like software_exp
      return userValue === req.value;
    }
  });

  return meetsRequirements ? <>{children}</> : <>{fallback}</>;
};

export default PersonalizedBlock;