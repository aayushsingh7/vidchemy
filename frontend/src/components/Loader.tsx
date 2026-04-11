interface LoaderProps { 
    text?:string;
}

const Loader: React.FC<LoaderProps> = ({text}) => {
  return (
    <div className="flex items-center justify-center bg-zinc-800 w-full flex-col">
        <div className="loader"/>
        {text && <p className="text-xl text-white font-inter text-bold mt-10">{text}</p>}
    </div>
  );
};

export default Loader;