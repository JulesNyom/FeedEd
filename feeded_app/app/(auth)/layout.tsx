const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center m-10 min-h-screen bg-white bg-cover">
      <div className="m-20 p-20 rounded-2xl flex bg-lightblue">
        <h1 className="font-bold text-xl">
          Planifiez simplement vos campagnes.
        </h1>
        <div></div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
