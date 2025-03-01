import './Container.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`max-w-screen-xl mx-auto ${className}`}>{children}</div>
  );
};

export default Container;
