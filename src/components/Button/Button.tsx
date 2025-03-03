import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  onClick,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`font-semibold px-5 py-2 rounded-md cursor-pointer transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
