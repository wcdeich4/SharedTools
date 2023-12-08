import { AreCoLinear } from '../math/AreCoLinear';
import { GenericVector } from '../math/GenericVector';
import { IMathDrawable } from './IMathDrawable';
import { RealNumberVector } from '../math/RealNumberVector';
// import { ComplexPoint } from '../math/ComplexPoint';
import { Pixel } from './Pixel';
// import { Coordinate2D } from './Coordinate2D';
import { ScreenRangeConverter2D } from '../math/ScreenRangeConverter2D';
import { Point2D } from '../math/Point2D';

export class MathCanvas2D
{
    private range: ScreenRangeConverter2D;
    public applySafetyChecks: boolean = true;
    public drawAxies2D: boolean = true;
    public xAxisColor: string | CanvasGradient | CanvasPattern = 'white';
    public yAxisColor: string | CanvasGradient | CanvasPattern = 'white';
    public backgroundColor: string | CanvasGradient | CanvasPattern | null = null;
    // private mostRecentCanvasToWorld2DVector: GenericVector<number>;
    // private mostRecentCanvasToWorld2DComplex: ComplexPoint;
    // private mostRecentCoordinate2D: Coordinate2D;

    public drawableArray: Array<IMathDrawable> = new Array<IMathDrawable>();
    
    private canvasRenderingContext2D: CanvasRenderingContext2D;
    private world2DPoint1: GenericVector<number>;
    private world2DPoint2: GenericVector<number>;

    //prevent new variable instantiation to save precious memory fps
    // private xAspectRatio: number = 0;
    // private yAspectRatio: number = 0;
    private canvasX1: number;
    private canvasY1: number;
    private canvasX2: number;
    private canvasY2: number;
    private canvasX3: number;
    private canvasY3: number;

    public constructor(canvas: CanvasRenderingContext2D, canvasRange?: ScreenRangeConverter2D, backgroundColor: string | CanvasGradient | CanvasPattern | null = null)
    {
        this.canvasRenderingContext2D = canvas;
        if (canvasRange != null)
        {
            this.setRange(canvasRange);
            // this.range = canvasRange;
            // this.onresize(); //not DRY
        }
        this.backgroundColor = backgroundColor;
        // this.mostRecentCanvasToWorld2DVector = new RealNumberVector();
        // this.mostRecentCanvasToWorld2DComplex = new ComplexPoint(0, 0);
        // this.mostRecentCoordinate2D = new Coordinate2D();  //TODO:  switch to only this.mostRecentCoordinate2D ?
    }

    /**
     * update x and y aspect ratios and width and height
     */
    public onresize(): void
    {
        if (this.range != null)
        {
            this.range.resize(this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height );
        }
    }

    /**
     * get width
     * @returns this.canvasRenderingContext2D.canvas.width
     */
    public getWidth(): number
    {
        return this.canvasRenderingContext2D.canvas.width;
    }

    /**
     * get height
     * @returns this.canvasRenderingContext2D.canvas.height
     */
    public getHeight(): number
    {
        return this.canvasRenderingContext2D.canvas.height ;
    }

    /**
     * remove all elements in the drawable array by setting the length to zero
     */
    public emptyDrawableArray(): void
    {
        this.drawableArray.length = 0;
    }

    /**
     * fill background with the background color
     */
    public fillWithBackgroundColor(): void
    {
        this.canvasRenderingContext2D.fillStyle = this.backgroundColor ;
        this.canvasRenderingContext2D.fillRect(0, 0, this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height);
    }

    /**
     * draw all the objects in the drawableArray in order
     */
    public draw(): void
    {
        this.Erase();

        if (this.backgroundColor != null)
        {
            this.canvasRenderingContext2D.fillStyle = this.backgroundColor ;
            this.canvasRenderingContext2D.fillRect(0, 0, this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height);
        }

        if (this.drawAxies2D)
        {
            this.drawLineWorld2D(this.range.xMin, 0, this.range.xMax, 0, this.xAxisColor);
            this.drawLineWorld2D(0, this.range.yMin, 0, this.range.yMax, this.yAxisColor);
        }
        this.drawableArray.forEach(d => d.draw(this));
    }

    /**
     * Set range. The this.range variable needs to be private so we can enforce this.onresize() to be called every time it is set.
     * @param range {ScreenRangeConverter2D} xMin, xMax, yMin, yMax for the size of the canvas pixels
     */
    public setRange(range: ScreenRangeConverter2D): void
    {
        this.range = range;
        this.onresize();
    }

    /**
     * get the current range object.  The this.range variable needs to be private so we can enforce this.onresize() to be called every time it is set.
     * @returns {ScreenRangeConverter2D} this.range
     */
    public getRange(): ScreenRangeConverter2D
    {
        return this.range;
    }

    /**
     * set range values and calculatePixelsPerUnit() if possible 
     * @param xMin minimum x
     * @param xMax maximum x
     * @param yMin minimum y
     * @param yMax maximum y
     */
    public setRangeValues(xMin: number, xMax: number, yMin: number, yMax: number): void
    {
        if (this.range == null)
        {
            let newRrange = new ScreenRangeConverter2D(xMin, xMax, yMin, yMax);
            this.setRange(newRrange);
        }
        else
        {
            this.range.set(xMin, xMax, yMin, yMax);
            this.onresize();
        }
        
    }

    /* not working!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! - actually did work, just did not produce desired results*/
    public AutoScaleWidthToMatchHeight(): void
    {
        //TODO: handle non-centered ranges
            let widthOverHeight: number = this.canvasRenderingContext2D.canvas.width / this.canvasRenderingContext2D.canvas.height; 
            this.range.xMax = this.range.yMax * widthOverHeight  ;
            this.range.xMin = this.range.yMin * widthOverHeight ;



        this.onresize();  //??????????
    }
    

    /**
     * clear contents of the canvas
     */
    public Erase(): void
    {
        this.canvasRenderingContext2D.clearRect(0, 0, this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height);
    }

    /**
     * draw triangle in World 2D coordinates
     * @param x1 x coordinate 1
     * @param y1 y coordinate 1
     * @param x2 x coordinate 2
     * @param y2 y coordinate 2
     * @param x3 x coordinate 3
     * @param y3 y coordinate 3
     * @param color {string | CanvasGradient | CanvasPattern} fill style
     */
    public drawTriangleWorld2D(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,  color: string | CanvasGradient | CanvasPattern): void
    {

        let drawLineInstead: boolean = this.applySafetyChecks && AreCoLinear.twoDimensional(x1, y1, x2, y2, x3, y3);
        if (drawLineInstead)
        {
            //Even thought these points are co-linear, there is no guarantee what order they are in, so we don't know which point is the one in the middle, and doing the math to find the point in the middle woudl take more time than just drawing two line segments
            this.drawTriangleOutlineWorld2D(x1, y1, x2, y2, x3, y3,  color);
        }
        else
        {
            this.canvasX1 = this.range.world2DXtoCanvasX(x1);
           // console.log("X1 = " + this.canvasX1);
            this.canvasY1 = this.range.world2DYtoCanvasY(y1);
            console.log("Y1 = " + this.canvasY1);

            this.canvasX2 = this.range.world2DXtoCanvasX(x2);
          //  console.log("X2 = " + this.canvasX2);
            this.canvasY2 = this.range.world2DYtoCanvasY(y2);
          //  console.log("Y2 = " + this.canvasY2);

            this.canvasX3 = this.range.world2DXtoCanvasX(x3);
          //  console.log("X3 = " + this.canvasX3);
            this.canvasY3 = this.range.world2DYtoCanvasY(y3);
            console.log("Y3 = " + this.canvasY3);

            this.canvasRenderingContext2D.beginPath();
            this.canvasRenderingContext2D.fillStyle = color;
            this.canvasRenderingContext2D.moveTo(this.canvasX1, this.canvasY1);
            this.canvasRenderingContext2D.lineTo(this.canvasX2, this.canvasY2);
            this.canvasRenderingContext2D.lineTo(this.canvasX3, this.canvasY3);
            this.canvasRenderingContext2D.closePath();
            this.canvasRenderingContext2D.fill();
        }
    }

    /**
     * draw triangle outline in World 2D coordinates
     * @param x1 x coordinate 1
     * @param y1 y coordinate 1
     * @param x2 x coordinate 2
     * @param y2 y coordinate 2
     * @param x3 x coordinate 3
     * @param y3 y coordinate 3
     * @param color {string | CanvasGradient | CanvasPattern} fill style
     */
    public drawTriangleOutlineWorld2D(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,  color: string | CanvasGradient | CanvasPattern): void
    {
        this.drawLineWorld2D(x1,y1, x2, y2, color);
        this.drawLineWorld2D(x2,y2, x3, y3, color);
        this.drawLineWorld2D(x3,y3, x1, y1, color);
    }

    /**
     * draw line segment array of verticies in world 2D
     * For speed sake, no safety checks are done
     * @param vertexArray Array of GenericVector<number>
     * @param color {string | CanvasGradient | CanvasPattern} stroke style
     */
    public drawLineSegmentVertexArrayWorld2D(vertexArray: Array<GenericVector<number>>, color: string | CanvasGradient | CanvasPattern): void
    {
        for(let i = 0; i < vertexArray.length - 1; i ++ )
        {
            this.world2DPoint1 = vertexArray[i];
            this.world2DPoint2 = vertexArray[i + 1];
            this.drawLineWorld2D(this.world2DPoint1.elements[0], this.world2DPoint1.elements[1], this.world2DPoint2.elements[0], this.world2DPoint2.elements[1], color);
        }
    }

    /**
     * draw line in World 2D coordinates
     * @param x1 x coordinate 1
     * @param y1 y coordinate 1
     * @param x2 x coordinate 2
     * @param y2 y coordinate 2
     * @param color {string | CanvasGradient | CanvasPattern} stroke style
     */
    public drawLineWorld2D(x1: number, y1: number, x2: number, y2: number, color: string | CanvasGradient | CanvasPattern): void
    {
        //no!  a single point line (degenerate line) is not srawn by default by HTML5 canvas!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if ((x1 == x2) && (y1 == y2))
        {
            //TODO: add drawPoint for circle
            this.drawPixelWorld2DCoordinates(x1, y1, color);
        }
        else
        {
            this.canvasX1 = this.range.world2DXtoCanvasX(x1);
            this.canvasY1 = this.range.world2DYtoCanvasY(y1);
         //   console.log("this.canvasY1 =" + this.canvasY1);
    
            this.canvasX2 = this.range.world2DXtoCanvasX(x2);
            this.canvasY2 = this.range.world2DYtoCanvasY(y2);
         //   console.log("this.canvasX2 =" + this.canvasX2);
       //     console.log("this.canvasY2 =" + this.canvasY2);
    
           // this.canvasRenderingContext2D.imageSmoothingEnabled = false;
    
            this.canvasRenderingContext2D.strokeStyle = color;
            this.canvasRenderingContext2D.beginPath();
            this.canvasRenderingContext2D.moveTo(this.canvasX1, this.canvasY1);
            this.canvasRenderingContext2D.lineTo(this.canvasX2, this.canvasY2);
            this.canvasRenderingContext2D.stroke();
        }


        
    }

    /**
     * fill a single pixel in World 2D coordinates from GenericVector<number>
     * @param piont {GenericVector<number>} coordinates
     * @param color {string | CanvasGradient | CanvasPattern} fill style
     */
    public drawPixelWorld2DCoordinatesFromVector(point: GenericVector<number>, color: string | CanvasGradient | CanvasPattern): void
    {
      //  console.log('parsedData = ' + point.elements[0] + ' , ' + point.elements[1]  );

        this.drawPixelWorld2DCoordinates(point.elements[0], point.elements[1], color)
    }

    /**
     * draw pixel object
     * @param p {Pixel} pixel to draw
     */
    public drawPixelWorld2D(p: Pixel): void
    {
        this.drawPixelWorld2DCoordinates(p.x, p.y, p.color);
    }

    /**
     * fill a single pixel in World 2D coordinates
     * @param x {number} x coordinate
     * @param y {number} y coordinate
     * @param color {string | CanvasGradient | CanvasPattern} fill style
     */
    public drawPixelWorld2DCoordinates(x: number, y: number, color: string | CanvasGradient | CanvasPattern): void
    {
        this.canvasX1 = this.range.world2DXtoCanvasX(x);
        this.canvasY1 = this.range.world2DYtoCanvasY(y);
    //    console.log('X1 = ' + this.canvasX1);
        this.canvasRenderingContext2D.fillStyle = color;
        this.canvasRenderingContext2D.fillRect(this.canvasX1, this.canvasY1, 1, 1);
    }

    public drawPixelCanvas2D(p: Pixel): void
    {
        this.canvasRenderingContext2D.fillStyle = p.color;
        this.canvasRenderingContext2D.fillRect(p.x, p.y, 1, 1);
    }


    // /**
    //  * protected helper method to convert 2D world cordinate x to Canvas x
    //  * @param x world two dimensional coordinate for x
    //  * @returns canvas coordinate for x
    //  */
    // protected world2DXtoCanvasX(x: number): number
    // {
    //     //return this.canvasRenderingContext2D.canvas.width * ( x + Math.abs(this.range.xMin) )  / this.range.xRange() ;
    //     return this.xAspectRatio * ( x + Math.abs(this.range.xMin) )  ;
    // }


    // /**
    //  * protected helper method to convert 2D world cordinate y to Canvas y
    //  * @param x world two dimensional coordinate for y
    //  * @returns canvas coordinate for y
    //  */
    // protected world2DYtoCanvasY(y: number): number
    // {
    //     return this.yAspectRatio * (  this.range.yMax - y )  ;
    // }




}