import { MathCanvas2D } from "./MathCanvas2D";
import { Fractile } from "./Fractile";
import { Pixel } from "./Pixel";
import { ScreenRangeWithDataFocusArea } from "../math/ScreenRangeWithDataFocusArea";

export class MandelbrotFractile extends Fractile
{
    public calculated: boolean = true;
    public iterationLimit: number = 80;
    private worker: Worker;
    private mathCanvas: MathCanvas2D = null;

    constructor()
    {
        super();
        //we may want to only evaluate points where some data can be found, while letting the whole range be resized to fit the screen
        //this.dataEvaluationRange 
        this.range  = new ScreenRangeWithDataFocusArea(-2.00, 0.47, -1.12, 1.12 ); 
      //  this.range.dataEvaluationRange = this.range.getRange2D();
        
     //   this.range.log();
        
    }

    public disposeOfWorker(): void
    {
      if (this.worker != undefined && this.worker != null)
      {
        this.worker.terminate();
        this.worker = undefined;
      }
    }

    public onresize(width: number, height: number): void
    {
        if (this.range != null)
        {
            this.range.resize(width, height);    
        }

        if (this.mathCanvas != null)
        {
            this.disposeOfWorker();
            this.draw(this.mathCanvas);
        }
    }


    draw(mathCanvas: MathCanvas2D): void 
    {
        this.mathCanvas = mathCanvas;

        // mathCanvas.range = this.range; //fails to set aspect ratios
        mathCanvas.setRange(this.range);
        mathCanvas.AutoScaleWidthToMatchHeight();
        mathCanvas.backgroundColor = 'red';
        mathCanvas.fillWithBackgroundColor();

        if (typeof Worker == 'undefined') {
            alert("Sorry, your browser does not support Web Workers...");
        }
        else
        {
        // Create a new web worker
        this.worker = new Worker(new URL('./Mandelbrot.WebWorker', import.meta.url));
        console.log('worker created');


        //max time to let worker run
        setTimeout(function(){ 
            if (this.worker != undefined && this.worker != null) { this.disposeOfWorker(); }
            }, 60000);

        this.worker.onmessage = ({ data }) => {
            let parsedData: Pixel  = null;
            try
            {
                parsedData = <Pixel>JSON.parse(data) as Pixel;

                mathCanvas.drawPixelCanvas2D(parsedData);

                //console.log('inside MandelbrotFractile, parsedData.x = ' + parsedData.x + ', parsedData.y = ' + parsedData.y );            
            }
            catch (error)
            {
                console.error('parsedData = JSON.parse(data) as Pixel produced error: ' + error.toString());
            }




            // if (parsedData.dot == null)
            // {
            //     console.log('parsedData.dot == null')
            // }
            // else //if (parsedData.dot != undefined)
            // {
            // console.log('parsedData.dot = ' + parsedData.dot);
            // mathCanvas.drawPixelWorld2D(parsedData.dot);
            // }

            // if (parsedData.finished != undefined)
            // {
            // console.log('dispsosing of worker');
            // this.disposeOfWorker();
            // }


        };
    //       worker.postMessage('message sent from FernDotFractile.ts to worker');
        }

        if (this.worker == null)
        {
            console.log('this.worker == null');
        }
        else
        {
            console.log('this.worker != null');

           // const limits0: ISize2D = new ISize2D(); //error
           // limits.width = mathCanvas.getWidth();
           // limits.height = mathCanvas.getHeight();
        //   const limits: ISize2D = { width: mathCanvas.getWidth(), height: mathCanvas.getHeight() };

       // this.worker.postMessage( JSON.stringify( mathCanvas.getRange()  ) );
       this.worker.postMessage( mathCanvas.getRange().conciseJSON() );


    //distorted the image b/c the worker thread was still going thru all the pixels of the screen, but the xMin & xMax did not
    //   this.dataEvaluationRange = this.range.clone();
    //   this.dataEvaluationRange.xMin = -2;
    //   this.dataEvaluationRange.xMax = 0.47;
    //    this.worker.postMessage( this.dataEvaluationRange.conciseJSON() );
    //    console.log('full range = '
    //    );
    //    mathCanvas.getRange().log();

            
/*
            const width = mathCanvas.getWidth();
            const height = mathCanvas.getHeight();
            let world2DCoordinates: Coordinate2D = null;
            for (let w = 0; w < width; w++)
            {
                for (let h = 0; h < height; h++) 
                {
                    world2DCoordinates = mathCanvas.canvasToWorld2DCoordinates(w, h);

    
                    this.worker.postMessage( JSON.stringify( world2DCoordinates  ) );
    
                   
    
    
    
                }
    
                
            }


        */

        }



    }

    process(): void {
        
    }

    
}