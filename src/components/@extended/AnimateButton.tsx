import PropTypes from 'prop-types';

import { motion } from 'framer-motion';

interface AnimateButtonProps {
  children: React.ReactNode;
  type?: 'slide' | 'scale' | 'rotate';
}

// Animation Button Component
const AnimateButton: React.FC<AnimateButtonProps> = ({ children, type = 'scale' }) => {
  switch (type) {
    case 'rotate':
    case 'slide':
    case 'scale':
    default:
      return (
        <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
          {children}
        </motion.div>
      );
  }
};

// Prop types
AnimateButton.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['slide', 'scale', 'rotate']),
};

export default AnimateButton;
