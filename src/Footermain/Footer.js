import React from 'react';
import './Footer.css'; // Ensure the CSS file is updated with class name changes
import logo from "../i/newlogo.gif";
import { FaTelegram } from 'react-icons/fa';

const MainFooter = () => {
    return (
        <footer className="mainfooter">
            <div className="mainfooter-container">
                <div className="mainfooter-section mainfooter-about">
                    <img src={logo} alt="Company Logo" className="mainfooter-logo" />
                    {/* <h3>Testdesk Edu Solutions Pvt. Ltd.</h3>
                    <p>2nd Floor, Plot No. 4, Minarch Tower, Sector-44, Gurgaon, Haryana, India, 122003</p> */}
                    <p>Email: testdesktypingtest@gmail.com</p>
                    {/* <p>Toll Free: 1800 203 0577</p>
                    <p>Office Hours: 10 AM to 7 PM (all 7 days)</p> */}
                </div>

                <div className="mainfooter-section mainfooter-links">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/">About us</a></li>
                        {/* <li><a href="/careers">Careers</a></li>
                        <li><a href="/teach">Teach Online on Testbook</a></li>
                        <li><a href="/media">Media</a></li>
                        <li><a href="/sitemap">Sitemap</a></li> */}
                    </ul>
                </div>

                <div className="mainfooter-section mainfooter-links">
                    <h4>Products</h4>
                    <ul>
                    <li><a href="/choose-exam">SSC CGL Typing Test</a></li>
<li><a href="/choose-exam">SSC CHSL Typing Test</a></li>
<li><a href="/choose-exam">IBPS PO Typing Test</a></li>
<li><a href="/choose-exam">RRB NTPC Typing Test</a></li>
<li><a href="/choose-exam">State Police Typing Test</a></li>
<li><a href="/choose-exam">Railway Typing Test</a></li>
{/* <li><a href="/Typing-test/cds">CDS Typing Test</a></li>
<li><a href="/Typing-test/airforce">Airforce Typing Test</a></li>
<li><a href="/Typing-test/nda">NDA Typing Test</a></li> */}
<li><a href="/choose-exam">Bank Clerk Typing Test</a></li>
{/* <li><a href="/Typing-test/army">Army Typing Test</a></li> */}
<li><a href="/choose-exam">Teacher Eligibility Typing Test</a></li>
<li><a href="/online-free-typing-test">Free Typing Test</a></li>



{/* <li><a href="/Typing-test/police">Police Constable Typing Test</a></li>
<li><a href="/Typing-test/upsc">UPSC Typing Test</a></li>
<li><a href="/Typing-test/railway-group-d">Railway Group D Typing Test</a></li>
<li><a href="/Typing-test/psc">State PSC Typing Test</a></li>
<li><a href="/Typing-test/ssc-stenographer">SSC Stenographer Typing Test</a></li> */}

                    </ul>
                </div>

                <div className="mainfooter-section mainfooter-apps">
                    {/* <h4>Our App</h4> */}
                    {/* <div className="app-links">
                        <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                            <img src="/path/to/app-store.png" alt="App Store" />
                        </a>
                        <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                            <img src="/path/to/google-play.png" alt="Google Play" />
                        </a>
                    </div> */}
                    <h4>Follow us on</h4>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        {/* <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a> */}
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="https://www.youtube.com/@Testdesktyping"><i className="fab fa-youtube"></i></a>
                        <a href="https://t.me/+4qa-d1bgP7pmYTVl" target="_blank" rel="noopener noreferrer">
      <FaTelegram className="fab fa-instagram" />
    </a>
                    </div>
                </div>
            </div>
            
            <div className="mainfooter-bottom">
                <p>Copyright © 2014-2024 Testdesk Edu Solutions Pvt. Ltd.: All rights reserved</p>
                <div className="mainfooter-policies">
                    <a href="/acceptable-use-policy">User Policy</a>
                    <a href="/terms-of-service">Terms</a>
                    <a href="/privacy-policy">Privacy</a>
                    <a href="/refund">Refund Policy</a>
                    <a href="/help">Contact Us</a>
                    <a href="/shipping">Shipping and Delivery</a>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
