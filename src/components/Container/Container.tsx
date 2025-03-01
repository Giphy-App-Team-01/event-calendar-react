import './Container.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full min-h-screen bg-white ${className}`}>{children}</div>
  );
};

export default Container;