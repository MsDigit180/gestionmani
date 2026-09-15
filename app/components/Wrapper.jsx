
export default function Wrapper({children}){
    return(
        <div className=" flex-col justify-start pt-12 min-h-screen min-h-screen bg-slate-900 text-white p-6 ">
            <div className="w-full max-w-4xl">
                {children}
            </div>
        </div>
    );
}