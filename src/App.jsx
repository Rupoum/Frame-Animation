import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  //currentIndex max index
  const [vals, setVals] = useState({
    currentIndex: 1,
    maxIndex: 445,
  });
  const imageObjects = useRef([]);
  const imagesLoaded = useRef(0);
  const canvasRef = useRef(null);

  //preloadImages

  useEffect(() => {
    preloadImages();
    console.log(imageObjects);
  }, []);

  const preloadImages = () => {
    console.log("Preloading images...");
    for (let i = 1; i <= vals.maxIndex; i++) {
      const imageUrl = `/hui/frame_${i.toString().padStart(4, "0")}.jpeg`;
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        imagesLoaded.current++;
        // console.log("load hcche");
        console.log(imagesLoaded.current);
        if (imagesLoaded.current === vals.maxIndex) {
          // console.log("sari images load ho gayi ");
          // show pehli image
          laodImage(vals.currentIndex);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${imageUrl}`);
      };
      imageObjects.current.push(img);
    }
  };

  //loadImages

  const laodImage = (index) => {
    if (index >= 0 && index <= vals.maxIndex) {
      const img = imageObjects.current[index];
      const canvas = canvasRef.current;
      if (canvas && img) {
        let ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const scaleX = canvas.width / img.width;
          const scaleY = canvas.height / img.height;
          const scale = Math.max(scaleX, scaleY);
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;

          const offsetX = (canvas.width - newWidth) / 2;
          const offsetY = (canvas.height - newHeight) / 2;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
          setVals((prevVals) => ({
            ...prevVals,
            currentIndex: index,
          }));
        }
      }
    }
  };
  //resizing

  const parentDivRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentDivRef.current,
        start: "top top ",
        scrub: 2,
        // markers: true,
        end: "bottom bottom ",
      },
    });

    tl.to(vals, {
      currentIndex: vals.maxIndex,
      onUpdate: () => {
        laodImage(Math.floor(vals.currentIndex));
      },
    });
  });

  return (
    <div className="w-full  bg-zinc-900">
      <div ref={parentDivRef} className="w-full h-[800vh]">
        <div className="w-full h-screen sticky left-0 top-0">
          <canvas ref={canvasRef} className="w-full h-screen"></canvas>
        </div>
      </div>
    </div>
  );
}
