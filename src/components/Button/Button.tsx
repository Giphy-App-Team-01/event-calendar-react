import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset"; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  onClick,
  type = "button", 
}) => {
  return (
    <button type={type} className={`${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;