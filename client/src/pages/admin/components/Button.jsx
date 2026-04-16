import PropTypes from "prop-types";

function Button({ bgColor, color, size, text = "Download", borderRadius }) {
  return (
    <button
      type="button"
      style={{ backgroundColor: bgColor, color, borderRadius }}
      className={`p-3 hover:drop-shadow-xl ${size ? `text-${size}` : ""}`}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  text: PropTypes.string,
  borderRadius: PropTypes.string,
};

export default Button;
