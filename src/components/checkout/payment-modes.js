import Error from "./error";

const PaymentModes = ({ input, handleOnChange }) => {
  const { errors, paymentMethod } = input || {};

  return (
    <div className="mt-3">
      <Error errors={errors} fieldName={"paymentMethod"} />
      {/*Direct bank transfers*/}
      <div className="form-check woo-next-payment-input-container mt-2">
        
      </div>
    </div>
  );
};

export default PaymentModes;
