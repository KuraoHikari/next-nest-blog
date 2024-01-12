import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
 children: React.ReactNode;
}

const ProtectedLayout = ({
 children,
}: ProtectedLayoutProps) => {
 return (
  <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 to-black">
   <Navbar />
   {children}
  </div>
 );
};

export default ProtectedLayout;
