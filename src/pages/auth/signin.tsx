import React from 'react';
import Layout from '@theme/Layout';
import SigninForm from '@site/src/components/Auth/SigninForm';
import Link from '@docusaurus/Link';

const SigninPage = () => {
  return (
    <Layout title="Sign In to Your Learning Dashboard" description="Sign in to access your personalized Physical AI & Humanoid Robotics learning experience">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="padding-horiz--md">
              <div className="text--center margin-bottom--lg">
                <h1 className="hero__title">Continue Your Learning</h1>
                <p className="hero__subtitle">
                  Sign in to access your personalized learning experience in Physical AI & Humanoid Robotics
                </p>
              </div>

              <div className="alert alert--info" role="alert">
                <p>
                  <strong>Your personalized content awaits!</strong> Sign in to continue your learning journey
                  where you left off, with content tailored to your experience level and hardware access.
                </p>
              </div>

              <div className="margin-vert--lg">
                <SigninForm />
              </div>

              <div className="text--center padding-top--md">
                <p>
                  Don't have an account?{' '}
                  <Link to="/auth/signup" className="button button--primary button--sm">
                    Get started here
                  </Link>
                </p>
              </div>

              <div className="margin-top--lg text--center">
                <p className="text--small text--muted">
                  Continue your personalized learning journey in Physical AI & Humanoid Robotics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SigninPage;