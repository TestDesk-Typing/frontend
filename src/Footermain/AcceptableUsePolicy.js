import React from 'react';
import './AcceptableUsePolicy.css'; // Import your CSS file for styling
import MainFooter from '../Footermain/Footer';
import TypingHeader from '../component/Header';
const AcceptableUsePolicy = () => {
  return (
    <>
    <TypingHeader/>
    <div className="acceptable-use-policy-container">
      <h1>Acceptable User Policy</h1>
      <p>
        Welcome to Testdesk! Our platform is designed to help you prepare for exams online. To ensure that everyone has a great experience, we ask you to follow our Acceptable Use Policy.
      </p>

      <h2>User Content Guidelines</h2>
      <p>You agree not to share any content that:</p>
      <ul>
        <li>Contains sexually explicit or pornographic material.</li>
        <li>Presents a risk of harm or injury to yourself, others, or animals.</li>
        <li>Could result in loss or damage to people or property.</li>
        <li>Seeks to exploit or harm children in any way.</li>
        <li>Violates laws or regulations.</li>
        <li>Includes hateful, violent, or abusive content.</li>
        <li>Is illegal or involves the disclosure of confidential information.</li>
        <li>Infringes on others' rights or intellectual property.</li>
        <li>Is misleading, fraudulent, or deceptive.</li>
      </ul>

      <h2>Prohibited Activities</h2>
      <p>In addition, please refrain from the following actions:</p>
      <ul>
        <li>Using our service, trademarks, or logos without permission.</li>
        <li>Accessing or tampering with non-public areas of the service.</li>
        <li>Testing the security of our systems without authorization.</li>
        <li>Bypassing any protective measures we have in place.</li>
        <li>Scraping or downloading content from our service without permission.</li>
        <li>Sending unsolicited spam or promotional messages.</li>
        <li>Using hidden metadata or meta tags without our consent.</li>
        <li>Using the service for unauthorized commercial purposes.</li>
        <li>Forging source-identifying information in communications.</li>
        <li>Interfering with other users' access to the service.</li>
        <li>Collecting personal information from other users without consent.</li>
        <li>Impersonating others or misrepresenting affiliations.</li>
        <li>Requesting sensitive information from other users.</li>
        <li>Encouraging others to engage in prohibited activities.</li>
        <li>Sharing your account credentials with others.</li>
      </ul>

      <p>
        We reserve the right to remove any content that violates these guidelines, and we may suspend or terminate accounts as necessary to maintain the integrity of our platform.
      </p>

      <p className="last-revised">
        Last revised on December 26th, 2024.
      </p>
    </div>
        <MainFooter/>
        </>
  );
};

export default AcceptableUsePolicy;
