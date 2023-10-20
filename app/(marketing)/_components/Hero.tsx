import Image from "next/image";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
            <Image 
              src="/work.png"
              alt="work illustration"
              fill
              className="object-contain"
            />
        </div>
      </div>
    </div>
  );
};

export default Hero;
