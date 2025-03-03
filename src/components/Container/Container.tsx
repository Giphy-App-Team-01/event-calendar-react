import './Container.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className='w-[1300px] mx-auto'>{children}</div>
    </div>
  );
};

export default Container;
