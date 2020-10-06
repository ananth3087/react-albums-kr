import React from "react";

const LazyImage = ({ src, className }) => {
  return (
    <img
      src={src}
      alt="Avatar"
      className={className}
      style={{ width: "100%" }}
    />
  );
};

export default LazyImage;
