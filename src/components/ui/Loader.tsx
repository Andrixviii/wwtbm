import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../../public/assets/Cute_Tiger.json';

const Loader = () => {
  return (
    <div style={{ width: 250, height: 250, margin: 'auto' }}>
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default Loader;
