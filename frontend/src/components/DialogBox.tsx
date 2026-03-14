import type { FC } from "react";

interface DialogBoxProps {
  title: string;
  description?: string;
  bulletPoints?:string[];
  btn1Text: string;
  btn1Style?:string;
  btn2Style?:string;
  onBtn1Click: () => void;
  btn2Text?: string;
  onBtn2Click?: () => void;
}

const DialogBox: FC<DialogBoxProps> = ({
  title,
  description,
  btn1Text,
  onBtn1Click,
  btn2Text,
  onBtn2Click,
  btn1Style,
  btn2Style,
  bulletPoints
}) => {
  return (
    <div className="z-100 fixed w-[100vw] h-[100dvh] flex items-center justify-center bg-black/80">
      <div className="border-2 border-zinc-500/30 bg-zinc-950 w-[500px] max-w-[90%] rounded-[10px]">
        <h3 className="text-xl font-bold text-white w-full p-5">{title}</h3>

        <div className="bg-zinc-900 p-5">

          <p className="text-lg text-gray-400 whitespace-pre-line" style={{marginBottom:description && (bulletPoints && bulletPoints?.length > 0) ? "15px" : "0px"}}>
            {description}
          </p>

          <div className="text-lg text-gray-400 whitespace-pre-line">
            {bulletPoints?.map((point:string, index:number)=> {
                return <span className="flex items-start justify-start "><span className="text-indigo-500 font-bold mr-2">{index+1}.</span><span>{point}</span></span>
            })}
          </div>

          <div
            className="gap-[20px] flex items-center mt-10"
            style={{
              justifyContent: btn2Text ? "space-between" : "end",
            }}
          >
            <button
              onClick={onBtn1Click}
              className={`${btn1Style} h-10 text-lg w-[50%] text-center px-5 active:scale-95 transition-all duration-200 rounded-[5px] text-white font-semibold flex items-center justify-center`}
            >
              {btn1Text}
            </button>

            {btn2Text && (
              <button
                onClick={onBtn2Click}
                className={`${btn2Style} h-10 text-lg w-[50%] text-center px-5 active:scale-95 transition-all duration-200 rounded-[5px] text-white font-semibold flex items-center justify-center`}
              >
                {btn2Text}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
