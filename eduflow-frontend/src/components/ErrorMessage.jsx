import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{
      background: "#fee2e2",
      color: "#991b1b",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "12px"
    }}>
      {message}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string
};

export default ErrorMessage;