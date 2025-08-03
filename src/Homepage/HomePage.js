


import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; // Import Helmet
import TypingHeader from '../component/Header';
import Banner from './Banner';
import AfterBanner from './AfterBanner';
import MainFooter from '../Footermain/Footer';
import HomePageDescription from './HomePageDescription';
import BrowseExam from './BrowseExam';
import ExamList from './ExamList';
import SlidingNoticeBox from './SlidingNoticeBox';



const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      
      {/* Helmet for SEO */}
      <Helmet>
        <title>Testdesk - Improve Typing Speed for SSC, CGL, DSSSB & More</title>
        <meta
          name="description"
          content="Testdesk helps you improve typing speed and accuracy with practice tests for SSC CHSL, CGL, DSSSB, EPFO, RRB, and more. Join now for government exam preparation!"
        />
        <meta
          name="keywords"
          content="typing test, typing speed, improve typing, SSC CHSL typing, CGL typing, DSSSB typing, EPFO typing, RRB typing test"
        />
        <meta name="author" content="Testdesk" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags for Social Sharing */}
        <meta property="og:title" content="Testdesk - Improve Typing Speed for SSC, CGL, DSSSB & More" />
        <meta
          property="og:description"
          content="Join Testdesk for the best typing practice tests for SSC CHSL, CGL, DSSSB, EPFO, and RRB exams. Improve typing speed and accuracy today!"
        />
     <meta property="og:image" content="https://testdesk.in/logo.png?v=1" />
        <meta property="og:url" content="https://testdesk.in" />
        <meta property="og:type" content="website" />

        {/* Twitter Card for Social Sharing */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Testdesk - Improve Typing Speed for SSC, CGL, DSSSB & More" />
        <meta
          name="twitter:description"
          content="Join Testdesk for the best typing practice tests for SSC CHSL, CGL, DSSSB, EPFO, and RRB exams. Improve typing speed and accuracy today!"
        />
        <meta name="twitter:image" content="https://testdesk.in/logo.png?v=1"  />
      
        {/* Canonical URL */}
        <link rel="canonical" href="https://testdesk.in" />

        
        <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Testdesk",
        "url": "https://testdesk.in",
        "logo": "https://testdesk.in/logo.png",
        "description": "Testdesk helps you improve typing speed with tests for SSC, CGL, DSSSB, EPFO, and RRB.",
        "sameAs": [
          "https://www.facebook.com/testdesk",
          "https://twitter.com/testdesk"
        ]
      }
    `}
  </script>
      </Helmet>

      {/* Components */}
      <TypingHeader />
      <Banner />
      <SlidingNoticeBox />
      <AfterBanner />
     
      <ExamList />
      <HomePageDescription />

      <BrowseExam />
      <MainFooter />
    </>
  );
};

export default HomePage;
