import React from 'react'

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="privacy-policy">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section>
          <h2>Introduction</h2>
          <p>
            Sub Tracker ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            protect your information when you use our service to analyze your
            YNAB transaction data for subscription tracking purposes.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <p>We collect and process the following types of information:</p>
          <ul>
            <li>
              <strong>Transaction Data:</strong> We access your YNAB transaction
              data solely for the purpose of identifying subscription-related
              transactions.
            </li>
            <li>
              <strong>OAuth Tokens:</strong> We store OAuth access tokens to
              authenticate with YNAB API on your behalf.
            </li>
            <li>
              <strong>Usage Data:</strong> Basic usage statistics to improve our
              service.
            </li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use your information exclusively for the following purposes:</p>
          <ul>
            <li>
              <strong>Subscription Detection:</strong> Analyzing your YNAB
              transactions to identify and categorize subscriptions
            </li>
            <li>
              <strong>Service Provision:</strong> Providing you with insights
              about your subscription usage and costs
            </li>
            <li>
              <strong>Service Improvement:</strong> Improving our transaction
              analysis and service functionality
            </li>
          </ul>
          <p>
            <strong>
              We do not use your data for any other purposes beyond those
              explicitly stated above.
            </strong>
          </p>
        </section>

        <section>
          <h2>Data Handling and Storage</h2>
          <ul>
            <li>
              <strong>Processing:</strong> Transaction data is processed to
              identify subscription patterns and recurring payments
            </li>
            <li>
              <strong>Storage:</strong> We store only essential subscription
              metadata (payee, amount, frequency) - not full transaction details
            </li>
            <li>
              <strong>Security:</strong> All data is encrypted in transit and at
              rest using industry-standard security measures
            </li>
            <li>
              <strong>Retention:</strong> Subscription data is retained only as
              long as you maintain an active account
            </li>
            <li>
              <strong>Location:</strong> Data is stored in secure cloud
              infrastructure with appropriate data protection measures
            </li>
          </ul>
        </section>

        <section>
          <h2>Third-Party Data Sharing</h2>
          <p>
            <strong>
              We guarantee that data obtained through YNAB API will not be
              shared with any third parties.
            </strong>{' '}
            We process your transaction data locally and securely without
            sharing it with external services for analysis.
          </p>
        </section>

        <section>
          <h2>Your Rights and Data Control</h2>
          <p>You have the following rights regarding your data:</p>
          <ul>
            <li>
              <strong>Access:</strong> Request access to your stored data
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your data at any
              time
            </li>
            <li>
              <strong>Portability:</strong> Request export of your subscription
              data
            </li>
            <li>
              <strong>Revocation:</strong> Revoke OAuth permissions through your
              Google account settings
            </li>
          </ul>
          <p>
            <strong>
              To exercise these rights or delete your data, contact us at:
              privacy@sub-tracker.app
            </strong>
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational security
            measures to protect your personal information:
          </p>
          <ul>
            <li>End-to-end encryption for data transmission</li>
            <li>Secure storage with encryption at rest</li>
            <li>Regular security audits and updates</li>
            <li>Limited access controls and authentication</li>
            <li>Compliance with industry security standards</li>
          </ul>
        </section>

        <section>
          <h2>OAuth Permissions</h2>
          <p>
            We request only the minimum necessary YNAB permissions to provide
            our service:
          </p>
          <ul>
            <li>
              <strong>Read access:</strong> To analyze transactions for
              subscription content
            </li>
            <li>
              <strong>Limited scope:</strong> We do not request unnecessary
              permissions
            </li>
          </ul>
          <p>
            You can revoke these permissions at any time through your YNAB
            account settings.
          </p>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>
          <p>
            If we change how we use your data or our privacy practices, we will:
          </p>
          <ul>
            <li>Update this privacy policy</li>
            <li>Notify you of material changes via email</li>
            <li>Request your consent for any new data uses</li>
          </ul>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy or want to exercise
            your data rights, please contact us at:
          </p>
          <ul>
            <li>
              <strong>Email:</strong> privacy@sub-tracker.app
            </li>
            <li>
              <strong>Data Protection Officer:</strong> dpo@sub-tracker.app
            </li>
          </ul>
        </section>

        <section>
          <h2>Compliance</h2>
          <p>This privacy policy is designed to comply with:</p>
          <ul>
            <li>YNAB API Terms of Service</li>
            <li>YNAB OAuth requirements</li>
            <li>General Data Protection Regulation (GDPR)</li>
            <li>California Consumer Privacy Act (CCPA)</li>
            <li>Other applicable data protection laws</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
