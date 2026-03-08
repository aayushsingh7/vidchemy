interface NoDataTemplateProps {
    text:string;
    height?:number;
}

const NoDataTemplate: React.FC<NoDataTemplateProps> = ({text,height=200}) => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-800 border-2 border-gray-500/20 rounded-[10px]" style={{height:`${height}px`}}>
       {text}
    </div>
  );
};

export default NoDataTemplate;