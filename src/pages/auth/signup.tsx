import React from 'react';
import Layout from '@theme/Layout';
import SignupForm from '@site/src/components/Auth/SignupForm';
import Link from '@docusaurus/Link';

const SignupPage = () => {
  return (
    <Layout title="Get Started Learning Physical AI & Humanoid Robotics" description="Create your personalized learning account for the Physical AI & Humanoid Robotics book">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="padding-horiz--md">
              <div className="text--center margin-bottom--lg">
                <h1 className="hero__title">Start Your Physical AI Journey</h1>
                <p className="hero__subtitle">
                  Create your account to personalize your learning experience in Physical AI & Humanoid Robotics
                </p>
              </div>

              <div className="alert alert--info" role="alert">
                <p>
                  <strong>Why personalize your learning?</strong> Answer a few questions about your background
                  to receive content tailored to your experience level and hardware access. This helps us
                  provide the right level of complexity and relevant examples for your learning path.
                </p>
              </div>

              <div className="margin-vert--lg">
                <SignupForm />
              </div>

              <div className="text--center padding-top--md">
                <p>
                  Already have an account?{' '}
                  <Link to="/auth/signin" className="button button--secondary button--sm">
                    Sign in here
                  </Link>
                </p>
              </div>

              <div className="margin-top--lg text--center">
                <p className="text--small text--muted">
                  By creating an account, you agree to our educational use of your background information
                  to enhance your learning experience in Physical AI & Humanoid Robotics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;