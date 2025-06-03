import React from 'react';
import MainFooter from '../Footermain/Footer';
import TypingHeader from '../component/Header';

const RefundPolicy = () => {
  return (
    <>
      <TypingHeader/>
      <div className="terms-container">
      <h2>Refund Policy</h2>
     
      <p>
        We believe in helping our customers as far as possible, and have therefore a liberal cancellation policy. Under this policy:
      </p>

      <h3>Cancellations</h3>
      <p>
        Cancellations will be considered only if the request is made within 2-3 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
      </p>

      <h3>Non-Cancellable Items</h3>
      <p>
        We do not accept cancellation requests for perishable items like flowers, eatables, etc. However, refund/replacement can be made if the customer establishes that the quality of the product delivered is not good.
      </p>

      <h3>Damaged or Defective Items</h3>
      <p>
        In case of receipt of damaged or defective items, please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same on their end. This should be reported within 2-3 days of receipt of the products.
      </p>

      <h3>Incorrect or Unsatisfactory Products</h3>
      <p>
        If you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2-3 days of receiving the product. The Customer Service Team, after looking into your complaint, will take an appropriate decision.
      </p>

      <h3>Products with Warranty</h3>
      <p>
        For complaints regarding products that come with a warranty from manufacturers, please refer to the issue to them.
      </p>

      <h3>Refund Processing</h3>
      <p>
        In case of any refunds approved, it will take 3-4 days for the refund to be processed to the end customer.
      </p>

      <h3>Changes to This Refund Policy</h3>
      <p>
        We may update our Refund Policy from time to time. Any changes will be posted on this page with an updated revision date.
      </p>
      <p>
        By using our services, you agree to the terms outlined in this Refund Policy.
      </p>
      <p>Last updated: November 10, 2024</p>
    </div>
          <MainFooter/>
          </>
  );
};

export default RefundPolicy;
