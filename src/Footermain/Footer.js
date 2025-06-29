import React from 'react';
import './Footer.css';
import logo from "../i/newlogo.gif";
import { FaTelegram, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const MainFooter = () => {
    return (
        <footer className="mainfooter">
            <div className="mainfooter-container">
                <div className="mainfooter-section mainfooter-about">
                    <div className="logo-container">
                        <img src={logo} alt="Company Logo" className="mainfooter-logo" />
                        <span className="company-name">Testdesk Edu Solutions</span>
                    </div>
                    <p className="contact-info">
                        <i className="fas fa-envelope"></i> testdesktypingtest@gmail.com
                    </p>
                    <div className="newsletter">
                        <input type="email" placeholder="Your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>

                <div className="mainfooter-section mainfooter-links">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/course-page/ssc-cgl-typing-test">About us</a></li>
                        {/* <li><a href="/blog">Blog</a></li> */}
                        <li><a href="/online-free-typing-test">Try Free</a></li>
                        <li><a href="/#">Careers</a></li>
                        <li><a href="/help">Contact</a></li>
                    </ul>
                </div>

                <div className="mainfooter-section mainfooter-links">
                    <h4>Typing Tests</h4>
                    <ul>
                        <li><a href="/choose-exam">SSC CGL Typing Test</a></li>
                        <li><a href="/choose-exam">SSC CHSL Typing Test</a></li>
                        <li><a href="/choose-exam">IBPS PO Typing Test</a></li>
                        <li><a href="/choose-exam">RRB NTPC Typing Test</a></li>
                        <li><a href="/choose-exam">State Police Typing Test</a></li>
                        <li><a href="/choose-exam">Railway Typing Test</a></li>
                    </ul>
                </div>

                <div className="mainfooter-section mainfooter-links">
                    <h4>More Tests</h4>
                    <ul>
                        <li><a href="/choose-exam">Bank Clerk Typing Test</a></li>
                        <li><a href="/choose-exam">Teacher Eligibility Test</a></li>
                        <li><a href="/online-free-typing-test">Free Typing Test</a></li>
                        <li><a href="/practice">Practice Tests</a></li>
                        <li><a href="/speed-test">Speed Test</a></li>
                        <li><a href="/accuracy-test">Accuracy Test</a></li>
                    </ul>
                </div>

                <div className="mainfooter-section mainfooter-social">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://www.youtube.com/@Testdesktyping" aria-label="YouTube"><FaYoutube /></a>
                        <a href="https://t.me/+4qa-d1bgP7pmYTVl" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                            <FaTelegram />
                        </a>
                    </div>
                    
                    {/* <h4 className="download-app">Download Our App</h4>
                    <div className="app-download">
                        <a href="#" className="app-store">
                            <span>Download on the</span>
                            <span>App Store</span>
                        </a>
                        <a href="#" className="play-store">
                            <span>Get it on</span>
                            <span>Google Play</span>
                        </a>
                    </div> */}
                </div>
            </div>
            
            <div className="mainfooter-bottom">
                <div className="mainfooter-policies">
                    <a href="/terms-of-service">Terms of Service</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/refund">Refund Policy</a>
                    <a href="/acceptable-use-policy">User Policy</a>
                    <a href="/help">Contact Us</a>
                </div>
                <p className="copyright">© 2014-{new Date().getFullYear()} Testdesk Edu Solutions Pvt. Ltd. All rights reserved</p>
            </div>
        </footer>
    );
};

export default MainFooter;