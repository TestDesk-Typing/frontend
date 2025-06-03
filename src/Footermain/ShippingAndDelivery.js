import React from 'react';
import MainFooter from '../Footermain/Footer';
import TypingHeader from '../component/Header';

const ShippingAndDelivery = () => {
  return (
    <>
      <TypingHeader/>
      <div className="terms-container">
      <h2>Shipping and Delivery</h2>
     

      <h3>International Buyers</h3>
      <p>
        For international buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.
      </p>

      <h3>Domestic Buyers</h3>
      <p>
        For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation, and delivery will be subject to the courier company/post office norms.
      </p>

      <h3>Delivery Time</h3>
      <p>
        Orders will be shipped within 0-7 days from the date of order and payment or as per the delivery date agreed at the time of order confirmation. We are not liable for any delay in delivery caused by the courier company or postal authorities. We guarantee to hand over the consignment to the courier company or postal authorities within this time frame.
      </p>

      <h3>Delivery Address</h3>
      <p>
        Delivery of all orders will be made to the address provided by the buyer during the order process.
      </p>

      <h3>Confirmation of Service Delivery</h3>
      <p>
        Delivery of our services will be confirmed via email to the mail ID provided during registration.
      </p>

      <h3>Contact Us</h3>
      <p>
        For any issues with utilizing our services or regarding shipping and delivery, you may contact our helpdesk at <strong>6203505821</strong> or <strong>testdesktypingtest@gmail.com</strong>.
      </p>
      <p>Last updated: November 10, 2024</p>
    </div>
    <MainFooter/>
    </>
  );
};

export default ShippingAndDelivery;
